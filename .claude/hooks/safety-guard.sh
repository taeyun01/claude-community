#!/usr/bin/env bash
# PreToolUse safety guard:
#   1) blocks Edit/Write/NotebookEdit on secret files (.env*, .mcp.json)
#   2) blocks Bash commands that modify/delete secret files
#   3) blocks Bash rm with both recursive + force flags (rm -rf and friends)
#   4) blocks git commit/push that would introduce secret-looking content
# Anything else passes through untouched.

input=$(cat)
tool_name=$(echo "$input" | jq -r '.tool_name // empty')

deny() {
  jq -n --arg reason "$1" '{
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "deny",
      permissionDecisionReason: $reason
    }
  }'
  exit 0
}

# Scans text (added diff lines / commit message) for secret-shaped patterns.
# Prints comma-separated category labels that matched; empty if none.
scan_for_secrets() {
  local text="$1"
  local found=""

  _hit() {
    printf '%s\n' "$text" | grep -Eiq -- "$1" && found="${found}${2}, "
  }

  _hit 'AKIA[0-9A-Z]{16}' "AWS Access Key"
  _hit '-----BEGIN [A-Z ]*PRIVATE KEY-----' "Private Key 블록"
  _hit 'sk-ant-[a-zA-Z0-9_-]{20,}' "Anthropic API Key"
  _hit 'sk-[a-zA-Z0-9]{20,}' "OpenAI/기타 sk- 형식 API Key"
  _hit 'sk_live_[0-9a-zA-Z]{24,}' "Stripe Live Key"
  _hit 'xox[baprs]-[0-9a-zA-Z-]{10,}' "Slack Token"
  _hit 'gh[pousr]_[a-zA-Z0-9]{36,}' "GitHub Token"
  _hit 'AIza[0-9a-zA-Z_-]{35}' "Google API Key"
  _hit 'sbp_[a-f0-9]{40}' "Supabase Access Token"
  _hit 'eyj[a-zA-Z0-9_-]{10,}\.eyj[a-zA-Z0-9_-]{10,}\.[a-zA-Z0-9_-]{10,}' "JWT 형식 토큰"
  _hit '(secret|api[_-]?key|access[_-]?key|token|password|passwd)[[:space:]]*[:=][[:space:]]*[\"'"'"']?[A-Za-z0-9_/+=-]{16,}' "일반 시크릿 할당 패턴"

  printf '%s' "$found"
}

is_secret_file() {
  case "$(basename -- "$1")" in
    .env | .env.* | .mcp.json) return 0 ;;
    *) return 1 ;;
  esac
}

case "$tool_name" in
  Edit | Write | NotebookEdit)
    file_path=$(echo "$input" | jq -r '.tool_input.file_path // .tool_input.notebook_path // empty')
    if [ -n "$file_path" ] && is_secret_file "$file_path"; then
      deny "비밀 파일(${file_path})은 자동으로 수정/생성할 수 없도록 막혀 있습니다. .env / .mcp.json류는 API 키·액세스 토큰이 들어있어 실수로 덮어쓰거나 유출될 위험이 있습니다. 정말 필요하면 사용자가 직접 수정해주세요."
    fi
    ;;

  Bash)
    command=$(echo "$input" | jq -r '.tool_input.command // empty')

    # rm with both recursive and force flags, in any order/combination
    has_rm=false
    echo "$command" | grep -Eq '(^|[;&|]|[[:space:]])rm([[:space:]]|$)' && has_rm=true
    if [ "$has_rm" = true ]; then
      has_recursive=false
      has_force=false
      echo "$command" | grep -Eiq -- '(-[a-zA-Z]*r[a-zA-Z]*([[:space:]]|$)|--recursive)' && has_recursive=true
      echo "$command" | grep -Eiq -- '(-[a-zA-Z]*f[a-zA-Z]*([[:space:]]|$)|--force)' && has_force=true
      if [ "$has_recursive" = true ] && [ "$has_force" = true ]; then
        deny "재귀+강제 삭제(rm -rf류) 명령은 되돌릴 수 없어 자동 차단됩니다. 정말 필요하면 사용자가 직접 터미널에서 실행해주세요. 명령: ${command}"
      fi
    fi

    # any write/delete-ish operation targeting a secret file by name
    if echo "$command" | grep -Eiq '(^|[^a-zA-Z0-9_./-])(\.env(\.[a-zA-Z0-9_-]+)?|\.mcp\.json)([^a-zA-Z0-9_./-]|$)'; then
      if echo "$command" | grep -Eiq '(^|[;&|[:space:]])(rm|mv|shred|truncate|sed[[:space:]]+-i|tee)([[:space:]]|$)|>>?[[:space:]]*[^[:space:]]*(\.env|\.mcp\.json)'; then
        deny "비밀 파일(.env*, .mcp.json)을 수정/삭제/덮어쓰는 명령이라 자동 차단됩니다. 토큰·키가 손실되거나 노출될 수 있어요. 명령: ${command}"
      fi
    fi

    # git commit: scan staged + unstaged diff, and the command text itself (-m message)
    if echo "$command" | grep -Eq '(^|[;&|]|[[:space:]])git[[:space:]]+commit([[:space:]]|$)'; then
      staged_added=$(git diff --cached -U0 2>/dev/null | grep -E '^[+]' | grep -v '^[+][+][+]')
      unstaged_added=$(git diff -U0 2>/dev/null | grep -E '^[+]' | grep -v '^[+][+][+]')
      scan_text=$(printf '%s\n%s\n%s' "$staged_added" "$unstaged_added" "$command")
      hits=$(scan_for_secrets "$scan_text")
      if [ -n "$hits" ]; then
        deny "커밋하려는 내용에 비밀키로 보이는 패턴이 있어 자동 차단됩니다: ${hits%, }. 실제 키라면 커밋에서 빼고 .env(gitignore 대상)로 옮기거나 키를 즉시 폐기(rotate)하세요. 오탐이면 사용자에게 직접 확인해달라고 요청하세요."
      fi
    fi

    # git push: scan the diff of commits not yet on the upstream/default remote branch
    if echo "$command" | grep -Eq '(^|[;&|]|[[:space:]])git[[:space:]]+push([[:space:]]|$)'; then
      upstream=$(git rev-parse --abbrev-ref --symbolic-full-name '@{u}' 2>/dev/null)
      if [ -n "$upstream" ]; then
        push_diff=$(git diff -U0 "${upstream}...HEAD" 2>/dev/null)
      else
        default_branch=$(git symbolic-ref refs/remotes/origin/HEAD 2>/dev/null | sed 's#^refs/remotes/##')
        if [ -n "$default_branch" ]; then
          push_diff=$(git diff -U0 "${default_branch}...HEAD" 2>/dev/null)
        else
          push_diff=$(git log -p -U0 -5 2>/dev/null)
        fi
      fi
      push_added=$(printf '%s' "$push_diff" | grep -E '^[+]' | grep -v '^[+][+][+]')
      hits=$(scan_for_secrets "$push_added")
      if [ -n "$hits" ]; then
        deny "푸시하려는 커밋에 비밀키로 보이는 패턴이 있어 자동 차단됩니다: ${hits%, }. 실제 키라면 히스토리에서 제거하고 키를 즉시 폐기(rotate)하세요. 오탐이면 사용자에게 직접 확인해달라고 요청하세요."
      fi
    fi
    ;;
esac

exit 0
