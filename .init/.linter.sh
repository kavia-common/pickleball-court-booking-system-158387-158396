#!/bin/bash
cd /home/kavia/workspace/code-generation/pickleball-court-booking-system-158387-158396/pickleball_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

