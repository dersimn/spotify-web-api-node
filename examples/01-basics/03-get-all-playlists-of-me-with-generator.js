const SpotifyWebApi = require('../../');

const spotifyApi = new SpotifyWebApi();
spotifyApi.setAccessToken(process.env.SPOTIFY_ACCESS_TOKEN);

(async () => {
  let playlistArray = [];
  for await (let snippet of spotifyApi.processNextGenerator(
    spotifyApi.getUserPlaylists(),
    'body'
  )) {
    playlistArray.push(...snippet);
  }

  let playlistNames = playlistArray.map(p => p.name);
  console.log(playlistNames);
})().catch(e => {
  console.error(e);
});
