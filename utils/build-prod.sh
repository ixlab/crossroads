#! /bin/sh

echo "Building prod...";

# Create structure and copy files
mkdir -p prod/views;
cp -r api/views/* prod/views;

# Compile source files
babel api/db -d prod/db;
babel api/routes -d prod/routes;
babel api/socket -d prod/socket;
babel api/utils -d prod/utils;
babel api/index.js -o prod/index.js;

echo "Complete!";
