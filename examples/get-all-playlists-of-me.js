const SpotifyWebApi = require('../');

const spotifyApi = new SpotifyWebApi();

/*
 * Call with `node examples/get-all-playlists-of-me.js "<Access Token>"`
 */
spotifyApi.setAccessToken(process.argv.slice(2)[0]);

(async () => {
  const playlistArray = await spotifyApi.getAll(
    spotifyApi.getUserPlaylists(),
    'body.next',
    'body.items'
  );

  let playlistNames = playlistArray.map(p => p.name);
  console.log(playlistNames);
})().catch(e => {
  console.error(e);
});
