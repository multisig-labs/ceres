#!/bin/bash

# This script squashes a git repo into a single commit with a specified commit message

# Check if git is installed
if ! git --version 1>/dev/null 2>&1; then
  echo "Error: git is not installed. Please install git and try again."
  exit 1
fi

# Check if the current directory is a git repository
if ! git rev-parse --is-inside-work-tree 1>/dev/null 2>&1; then
  echo "Error: Not in a git repository. Please run this script in a git repo."
  exit 1
fi

# Check if a commit message is provided
if [ -z "$1" ]; then
  echo "Error: Please provide a commit message."
  echo "Usage: ./big_squash.sh \"Your commit message\""
  exit 1
else
  COMMIT_MESSAGE=$1
fi

# Get the current branch
CURRENT_BRANCH="$(git symbolic-ref --short HEAD)"

# Backup the current branch
BACKUP_BRANCH="$CURRENT_BRANCH-backup"
git checkout -b "$BACKUP_BRANCH"
git checkout "$CURRENT_BRANCH"

# Create a new temporary branch and switch to it
TEMP_BRANCH="temp-squash-branch"
git checkout --orphan "$TEMP_BRANCH"

# Add all the files to the new branch and commit with the specified message
git add -A
git commit -m "$COMMIT_MESSAGE"

# Replace the current branch with the new temporary branch
git branch -M "$TEMP_BRANCH" "$CURRENT_BRANCH"

# Delete backup branch (optional)
# git branch -D "$BACKUP_BRANCH"

echo "Successfully squashed the branch into a single commit: $COMMIT_MESSAGE"
exit 0
