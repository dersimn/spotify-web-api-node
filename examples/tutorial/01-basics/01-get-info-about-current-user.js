const SpotifyWebApi = require('../../../');

const spotifyApi = new SpotifyWebApi();
spotifyApi.setAccessToken(process.env.SPOTIFY_ACCESS_TOKEN);

(async () => {
  const me = (await spotifyApi.getMe()).body;
  console.log(me);
})().catch(e => {
  console.error(e);
});
