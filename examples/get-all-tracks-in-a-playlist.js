const SpotifyWebApi = require('../');

const spotifyApi = new SpotifyWebApi();

/*
 * Call from root folder with `node examples/get-all-tracks-in-a-playlist.js "<Access Token>"`
 */
spotifyApi.setAccessToken(process.argv.slice(2)[0]);

(async () => {
  const playlist = (await spotifyApi.getUserPlaylists()).body.items[0];
  console.log(
    `Getting playlist ${playlist.name} with ${playlist.tracks.total} tracks.`
  );

  const tracks = await spotifyApi.getAll(
    spotifyApi.getPlaylistTracks(playlist.id),
    'body.next',
    'body.items'
  );
  console.log(`Got ${tracks.length} in total:`);
  console.log(tracks.map(t => `${t.track.artists[0].name} - ${t.track.name}`));
})().catch(e => {
  console.error(e);
});
