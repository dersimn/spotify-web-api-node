const SpotifyWebApi = require('../../');

const spotifyApi = new SpotifyWebApi();
spotifyApi.setAccessToken(process.env.SPOTIFY_ACCESS_TOKEN);

(async () => {
  const playlistArray = await spotifyApi.getAllUserPlaylists();

  let playlistNames = playlistArray.map(p => p.name);
  console.log(playlistNames);
})().catch(e => {
  console.error(e);
});
