const SpotifyWebApi = require('../../');

const spotifyApi = new SpotifyWebApi();
spotifyApi.setAccessToken(process.env.SPOTIFY_ACCESS_TOKEN);

(async () => {
  const playlistArray = await spotifyApi.getAllUserPlaylists();
  const playlistName = process.argv.slice(2)[0] || 'Test';
  const testPlaylistId = playlistArray.find(p => p.name == playlistName).id;
  console.log(`Using Playlist '${playlistName}' with id '${testPlaylistId}'`);

  const tracks = await spotifyApi.getAllPlaylistTracks(testPlaylistId);
  const localTracks = tracks.filter(t => t.is_local);

  for (track of localTracks) {
    console.log(track.track.uri);
  }
})().catch(e => {
  console.error(e);
});
