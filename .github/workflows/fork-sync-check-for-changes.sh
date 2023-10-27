#!/bin/bash

if [ "$#" -ne 2 ]; then
  echo "Usage: $0 <fork_branch> <upstream_branch>"
  exit 1
fi

fork_branch="$1"
upstream_branch="$2"

# Fetch branches and check for changes
git fetch origin "$fork_branch:origin_$fork_branch"
git fetch upstream "$upstream_branch:upstream_$upstream_branch"
CHANGES=$(git log --oneline "origin_$fork_branch..upstream_$upstream_branch")
echo "Changes: $CHANGES"

if [ -n "$CHANGES" ]; then
  echo "Changes found"
  exit 0 # Success
else
  echo "No changes found"
  exit 1 # Failure
fi
