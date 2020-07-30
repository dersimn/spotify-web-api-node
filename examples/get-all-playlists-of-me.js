const SpotifyWebApi = require('../');

const spotifyApi = new SpotifyWebApi();

/*
 * Call with `node examples/get-all-playlists-of-me.js "<Access Token>"`
 */
spotifyApi.setAccessToken(process.argv.slice(2)[0]);

(async () => {
  let playlistArray = [];
  await spotifyProcessNext(spotifyApi.getUserPlaylists(), data => {
    playlistArray = playlistArray.concat(data.body.items);
  });

  let playlistNames = playlistArray.map(p => p.name);
  console.log(playlistNames);
})().catch(e => {
  console.error(e);
});

function spotifyProcessNext(initialPromise, processFunction) {
  return new Promise((resolve, reject) => {
    function _internalRecursive(promise, processFunction, resolve, reject) {
      promise
        .then(response => {
          processFunction(response);

          if (response.body.next) {
            _internalRecursive(
              spotifyApi.getGeneric(response.body.next),
              processFunction,
              resolve,
              reject
            );
          } else {
            resolve();
          }
        })
        .catch(err => {
          reject(err);
        });
    }
    _internalRecursive(initialPromise, processFunction, resolve, reject);
  });
}
