# scratch

...a chatbot system skeleton.

## Overview

+ `httpserver.js`
    + serving the host website including the chatview
    + authority for session management
+ `wsserver.js`
    + providing a chatbot for each chatview
+ `auth-channel.js`
    + exports: `{ class Commander, class Consumer }`
    + purpose: `httpserver: Commander -> wsserver: Consumer`
    + for forwarding user authorization
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

## Training a bot

Define mappings in `boot-brain.js`. That is it.

## Demo

Just start both servers from a terminal:

`node httpserver --commander`

`node wsserver --consumer`

And hit `localhost:50000` with a browser.

## Outlook

+ enhance conversational skills of `class Chatbot` through new methods
+ find suitable means for efficient NLP
+ move from `ws` to `wss`
