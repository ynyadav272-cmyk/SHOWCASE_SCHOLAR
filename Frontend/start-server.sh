#!/bin/bash
# Start http-server accessible from all network interfaces with cache disabled
npx http-server -p 8000 -a 0.0.0.0 -c-1
