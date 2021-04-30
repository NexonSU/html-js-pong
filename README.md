# html-js-pong
Simple pong game on HTML and JS

## Only singleplayer installation
1. Upload files to your webserver.
2. Fix .js/.css/.mp3 links, if needed.

## Additional installation for multiplayer
1. Install NodeJS to your webserver.
2. Setup your frontend webserver for serving websocket requests.
3. Change websocket URL in js/multiplayer-tdm.js.
4. Change port in js/server.js, if needed.
5. Start server:
`node js/server.js`
