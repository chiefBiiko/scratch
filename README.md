# scratch

...a chatbot system skeleton.

## Overview

+ `server`
    + `wsserver.js`
        + providing a chatbot for each chatview
    + `chatview.html`
        + minimal chatview condensed in one file
    + `bot`
        + `approx-map.js`
            + exports: `class ApproxMap`
            + map data structure for approximate mapping of strings
        + `boot-brain.js`
            + exports a matrix of predefined mappings
            + can be passed to the constructor of `class ApproxMap`
        + `chatbot.js`
            + exports: `class ChatBot`
            + responsible for user interaction
            + a chatbot is always bound to one particular websocket

## Outlook

+ enhance conversational skills of `class ChatBot` through new methods
+ find suitable means for efficient NLP
+ move from `ws` to `wss`
