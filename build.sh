#!/usr/bin/env bash
# exit on error
set -o errexit

npm install

# Install Puppeteer's bundled Chrome browser explicitly during build.
# This ensures Chrome is available at runtime on Render.com.
npx puppeteer browsers install chrome
