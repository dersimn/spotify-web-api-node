/*

    Run with:

        export SPOTIFY_ACCESS_TOKEN="<Token content here>"
        node example/folder/file.js <Playlist Name>

    Playlist Name defaults to 'Test' if not provided.

*/
const SpotifyWebApi = require('../../../');
const https = require('https');

const spotifyApi = new SpotifyWebApi();
spotifyApi.setAccessToken(process.env.SPOTIFY_ACCESS_TOKEN);

const playlistName = process.argv.slice(2)[0] || 'Test';

(async () => {
  const userId = (await spotifyApi.getMe()).body.id;
  const userPlaylists = await spotifyApi.getAllUserPlaylists();

  // Find Playlist by Name
  const playlistByName = userPlaylists.filter(p => p.name == playlistName);
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

  // Get Tracks from old Playlist
  const tracks = await spotifyApi.getAllPlaylistTracks(playlist.id);
  console.log(`Found ${tracks.length} tracks in Playlist`);

  // Get Cover Image
  const coverImageUrl = playlist.images[0].url;
  let coverImageBuffer;
  https
    .get(coverImageUrl, res => {
      const contentType = res.headers['content-type'];
      if (contentType !== 'image/jpeg') {
        throw new Error('Wrong content-type: ' + contentType);
      }

      let data = [];
      res.on('data', chunk => {
        data.push(chunk);
      });
      res.on('end', () => {
        coverImageBuffer = Buffer.concat(data);
      });
    })
    .on('error', e => {
      throw new Error(e);
    });

  // Create new Playlist
  const newPlaylist = await spotifyApi.createPlaylist(
    userId,
    playlistName + ' (duplicate)',
    {
      public: false,
      description: playlist.description
    }
  );
  const newPlaylistId = newPlaylist.body.id;
  console.log(
    `Created Playlist '${newPlaylist.body.name}' with id '${newPlaylistId}'`
  );

  // Add Tracks to new Playlist (add max. 100 Tracks per Request according do API Spec)
  const trackUris = tracks.map(t => t.track.uri);
  const chunkLength = 100;
  for (let i = 0; i < trackUris.length; i += chunkLength) {
    const chunk = trackUris.slice(i, i + chunkLength);
    await spotifyApi.addTracksToPlaylist(newPlaylistId, chunk);
  }
  console.log('Added Tracks to new Playlist');

  // Upload Cover Image
  await spotifyApi.uploadCustomPlaylistCoverImage(
    newPlaylistId,
    coverImageBuffer.toString('base64')
  );
  console.log('Uploaded old Cover Image to new Playlist');
})().catch(e => {
  console.error(e);
});
