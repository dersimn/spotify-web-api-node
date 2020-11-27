/**
 * In root directory run
 *
 *     npm install cli-progress
 *
 * then run then run this script.
 */
const SpotifyWebApi = require('../../../../');
const SpotifyWebApiTools = require('../../spotify-web-api-tools.js');
const CliProgress = require('../../../../node_modules/cli-progress');
const multibar = new CliProgress.MultiBar({
    clearOnComplete: false,
    hideCursor: true,
    format: '[{bar}] {percentage}% | {title} | ETA: {eta}s | {value}/{total}',
});

const spotifyApi = new SpotifyWebApi();
const swat = new SpotifyWebApiTools(spotifyApi);

spotifyApi.setAccessToken(process.env.SPOTIFY_ACCESS_TOKEN);

(async () => {
  const userId = (await spotifyApi.getMe()).body.id;

  const localTrackList = {};

  // Identify all Local Tracks in User's Playlists that are writeable by User
  const userPlaylists = (await swat.getAllUserPlaylists()).filter(p => (p.owner.id === userId) || p.collaborative);

  const barIdentify = multibar.create(userPlaylists.length, 0, {title: 'Identify Local Tracks in Playlists'});

  for (const playlist of userPlaylists) {
    const tracks = await swat.getAllPlaylistTracks(playlist.id);

    tracks.forEach((track, position) => {
      const uri = track.track.uri;

      if (track.is_local) {
        if (!(uri in localTrackList)) {
          localTrackList[uri] = {
            trackObj: track.track,
            inPlaylists: [
              {
                id: playlist.id,
                position: position
              }
            ],
            matches: []
          };
        } else {
          localTrackList[uri].inPlaylists.push({
            id: playlist.id,
            position: position
          });
        }
      }
    });

    barIdentify.increment();
  }

  // For each Local Track, try to find a Match that's available in Spotify's Database
  const barSearch = multibar.create(Object.keys(localTrackList).length, 0, {title: 'Search for Matches'});

  for (let [uri, localTrack] of Object.entries(localTrackList)) {
    const search = await spotifyApi.searchTracks(localTrack.trackObj.name + ' artist:'+localTrack.trackObj.artists[0].name);

    localTrack.matches.push(...search.body.tracks.items);

    barSearch.increment();
  }

  for (let [uri, localTrack] of Object.entries(localTrackList)) {
    const localArtist = localTrack.trackObj.artists[0].name;
    const localTitle = localTrack.trackObj.name;
    const localDuration = localTrack.trackObj.duration_ms;

    const matchArtist = localTrack.matches[0]?.artists[0]?.name;
    const matchTitle = localTrack.matches[0]?.name;
    const matchDuration = localTrack.matches[0]?.duration_ms;

    console.log(`${localArtist}/${matchArtist} - ${localTitle}/${matchTitle} - ${localDuration-matchDuration}`);
  }

  // Filter


  multibar.stop();
})().catch(e => {
  console.error(e);
});
