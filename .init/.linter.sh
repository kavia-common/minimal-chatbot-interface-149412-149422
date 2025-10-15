#!/bin/bash
cd /home/kavia/workspace/code-generation/minimal-chatbot-interface-149412-149422/gemini_chatbot_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

