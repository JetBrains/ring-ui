#!/bin/bash
if [[ -d "node_modules" ]]
then
  echo "node_modules directory already exists, skipping bootstrap..."
  exit 0
fi

echo "Installing dependencies..."
npm ci
echo "Done!"
