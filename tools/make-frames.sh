#!/bin/bash
# Usage: ./make-frames.sh input.mp4 [start_sec] [end_sec]
# Rebuilds frames/ from any video (e.g. an Unsplash clip). Then set FRAMES in js/main.js to the printed count.
rm -f ../frames/*.webp
ffmpeg -ss ${2:-0} -to ${3:-7} -i "$1" -vf "fps=24,scale=1280:-2:flags=lanczos" -c:v libwebp -quality 72 ../frames/f%03d.webp
ls ../frames | wc -l
