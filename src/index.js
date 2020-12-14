
import { authenticate, getPlaylist, getPodcastEpisodes, emptyPlaylist, addTracksToPlaylist } from './spotify';
import { connect, disconnect } from './mongo';

const run = async () => {
    // connect to mongo
    await connect();

    console.log('Starting up...');

    // authenticate with spotify

    await authenticate();

    // get the news brief playlist
    console.log('getting playlist');
    let playlist = await getPlaylist();
    console.log(playlist.tracks.items);
    // empty the playlist
    console.log('emptying playlist');
    playlist = await emptyPlaylist(playlist);

    // get tracks to add
    console.log('finding episodes');
    const tracks = await getPodcastEpisodes();
   
    // add tracks to playlist
    console.log('adding episodes to playlist')
    playlist = await addTracksToPlaylist(tracks, playlist);

    // cleanup connections
    await disconnect();

    console.log('all done, lets exit');
    process.exit(0);
}
run();

function exitOnSignal(signal) {
    process.on(signal, function () {
        console.log('\ncaught ' + signal + ', exiting');
        // disconnect();
        process.exit(1);
    });
}

exitOnSignal('SIGINT');
exitOnSignal('SIGTERM');