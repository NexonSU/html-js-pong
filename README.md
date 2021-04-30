# html-js-pong
Simple pong game on HTML and JS.
Demo: https://pong.nexon.su/

## Only singleplayer installation
1. Upload files to your webserver.
2. Fix .js/.css/.mp3 links, if needed.

## Additional installation for multiplayer
1. Install NodeJS to your webserver.
2. Install websocket module: `npm install ws`
3. Setup your frontend webserver for serving websocket requests.
4. Change websocket URL in js/multiplayer-tdm.js.
5. Change port in js/server.js, if needed.
6. Start server: `node js/server.js`
