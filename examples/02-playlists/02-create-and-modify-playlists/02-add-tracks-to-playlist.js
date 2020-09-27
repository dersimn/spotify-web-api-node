/*

    Run with:

        export SPOTIFY_ACCESS_TOKEN="<Token content here>"
        node example/folder/file.js <Playlist Name>

    Playlist Name defaults to 'Test' if not provided.

*/
const SpotifyWebApi = require('../../../');

const spotifyApi = new SpotifyWebApi();
spotifyApi.setAccessToken(process.env.SPOTIFY_ACCESS_TOKEN);

const playlistName = process.argv.slice(2)[0] || 'Test';

(async () => {
  const playlistArray = await spotifyApi.getAllUserPlaylists();

  const playlistByName = playlistArray.filter(p => p.name == playlistName);
  if (playlistByName.length > 1) {
    throw new Error(
      'Could not find unique Playlist with Name: ' + playlistName
    );
  }
  if (playlistByName.length === 0) {
    throw new Error('Could not Playlist with Name: ' + playlistName);
  }
  const playlist = playlistByName[0];
  console.log(`Using Playlist '${playlist.name}' with id '${playlist.id}'`);

  await spotifyApi.addTracksToPlaylist(
    playlist.id,
    [
      'spotify:track:4iV5W9uYEdYUVa79Axb7Rh',
      'spotify:track:1301WleyT98MSxVHPZCA6M'
    ],
    {
      position: 10
    }
  );
})().catch(e => {
  console.error(e);
});
