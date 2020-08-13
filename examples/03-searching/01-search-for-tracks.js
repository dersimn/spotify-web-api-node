const SpotifyWebApi = require('../../');

const spotifyApi = new SpotifyWebApi();
spotifyApi.setAccessToken(process.env.SPOTIFY_ACCESS_TOKEN);

(async () => {
  const searchResults = await spotifyApi.getAtLeast(
    spotifyApi.searchTracks('Love'),
    'body.tracks',
    50
  );

  console.log('The first 50+ tracks are (popularity in parentheses):');
  /*
   * All of Me (97)
   * My Love (91)
   * I Love This Life (78)
   * ...
   */
  for (const track of searchResults) {
    console.log(track.name + ' (' + track.popularity + ')');
  }
  console.log(`We got actually ${searchResults.length} search results.`);
})().catch(e => {
  console.error(e);
});
