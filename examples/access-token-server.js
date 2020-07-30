/**
 * Copy this file somewhere else and run:
 *
 *     npm install spotify-web-api-node express
 *
 * then run with the followinng command. If you don't have a client_id and client_secret yet,
 * create an application on Create an application here: https://developer.spotify.com/my-applications to get them.
 * Make sure you whitelist the correct redirectUri in line 26.
 *
 *     node access-token-server.js "<Client ID>" "<Client Secret>"
 *
 *  and visit <http://localhost:8888/login> in your Browser.
 */

const SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');

const scopes = [
  'playlist-read-private',
  'playlist-read-collaborative',
  'playlist-modify-public',
  'playlist-modify-private'
];

const spotifyApi = new SpotifyWebApi({
  redirectUri: 'http://localhost:8888/callback',
  clientId: process.argv.slice(2)[0],
  clientSecret: process.argv.slice(2)[1]
});

const app = express();

app.get('/login', (req, res) => {
  res.redirect(spotifyApi.createAuthorizeURL(scopes));
});

app.get('/callback', (req, res) => {
  const error = req.query.error;
  const code = req.query.code;
  const state = req.query.state;

  if (error) {
    console.error('Callback Error:', error);
    res.send(`Callback Error: ${error}`);
    return;
  }

  spotifyApi.authorizationCodeGrant(code).then(
    data => {
      const access_token = data.body['access_token'];
      const refresh_token = data.body['refresh_token'];
      const expires_in = data.body['expires_in'];

      spotifyApi.setAccessToken(access_token);
      spotifyApi.setRefreshToken(refresh_token);

      console.log('access_token:', access_token);
      console.log('refresh_token:', refresh_token);

      console.log(
        `Sucessfully retreived access token. Expires in ${
          data.body['expires_in']
        } s.`
      );
      res.send('Success! You can now close the window.');
    },
    error => {
      console.error('Error getting Tokens:', error);
      res.send(`Error getting Tokens: ${error}`);
    }
  );
});

app.listen(8888, () => {
  console.log(
    'HTTP Server up. Now go to http://localhost:8888/login in your browser.'
  );
});
