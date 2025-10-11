# Function to get the current Git branch name
parse_git_branch() {
    branch=$(git branch 2>/dev/null | grep '^*' | colrm 1 2)
    if [ -n "$branch" ]; then
        echo " $branch"
    fi
}

# Gets path relative to `/workspace`
get_workspace_path() {
  local path=${PWD#/workspace}
  if [[ -z "$path" ]]; then
    echo "(project root)"
  else
    # remove leading slash
    echo "${path#/}"
  fi
}

# Update the PS1 prompt to include the Git branch in fuchsia
export PS1="\n\[$(tput sgr0)\]\[\033[38;5;2m\][\[$(tput sgr0)\]\t \[$(tput sgr0)\]\[\033[38;5;11m\]\$(get_workspace_path)\[$(tput sgr0)\]\[\033[38;5;13m\]\
\$(parse_git_branch)\[$(tput sgr0)\]\[\033[38;5;2m\]]\[$(tput sgr0)\]\n\[$(tput sgr0)\]\[\033[38;5;2m\]\\$\[$(tput sgr0)\] \[$(tput sgr0)\]"
