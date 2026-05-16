#!/usr/bin/env bash
# exit on error
set -o errexit

npm install
# No way to install system libraries here without root, 
# which is why Docker is preferred.
