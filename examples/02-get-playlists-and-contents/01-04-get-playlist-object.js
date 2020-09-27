/*

    Run with:

        export SPOTIFY_ACCESS_TOKEN="<Token content here>"
        node example/folder/file.js <Playlist Name>

    Playlist Name defaults to 'Test' if not provided.

*/
const SpotifyWebApi = require('../../');

const spotifyApi = new SpotifyWebApi();
spotifyApi.setAccessToken(process.env.SPOTIFY_ACCESS_TOKEN);

const playlistName = process.argv.slice(2)[0] || 'Test';

(async () => {
  const playlistArray = await spotifyApi.getAllUserPlaylists();
  const testPlaylistId = playlistArray.find(p => p.name == playlistName).id;
  console.log(`Using Playlist '${playlistName}' with id '${testPlaylistId}'`);

  const playlist = await spotifyApi.getPlaylist(testPlaylistId);
  console.log(playlist);
})().catch(e => {
  console.error(e);
});
