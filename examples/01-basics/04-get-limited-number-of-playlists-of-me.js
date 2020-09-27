const SpotifyWebApi = require('../');

const spotifyApi = new SpotifyWebApi();
spotifyApi.setAccessToken(process.env.SPOTIFY_ACCESS_TOKEN);

(async () => {
  const playlistArray = await spotifyApi.getAtLeast(
    spotifyApi.getUserPlaylists(),
    'body',
    50
  );

  let playlistNames = playlistArray.map(p => p.name);
  console.log(playlistNames);
  console.log(
    `Got ${
      playlistNames.length
    } of your playlits. Sorry that it is slightly more than you asked.`
  );
})().catch(e => {
  console.error(e);
});
