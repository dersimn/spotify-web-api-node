const SpotifyWebApi = require('../../');

const spotifyApi = new SpotifyWebApi();
spotifyApi.setAccessToken(process.env.SPOTIFY_ACCESS_TOKEN);

(async () => {
  const playlistArray = await spotifyApi.getAllUserPlaylists();
  const playlistName = process.argv.slice(2)[0] || 'Test';
  const testPlaylistId = playlistArray.find(p => p.name == playlistName).id;
  console.log(`Using Playlist '${playlistName}' with id '${testPlaylistId}'`);

  spotifyApi.removeTracksFromPlaylist(testPlaylistId, [
    { uri: 'spotify:track:4iV5W9uYEdYUVa79Axb7Rh' },
    { uri: 'spotify:track:1301WleyT98MSxVHPZCA6M' }
  ]);
})().catch(e => {
  console.error(e);
});
