
import { authenticate, getPlaylist, getPodcastEpisodes, replaceTracksInPlaylist } from './spotify';
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

    // get tracks to add
    console.log('finding episodes');
    const tracks = await getPodcastEpisodes();
   
    // replace tracks in the playlist
    console.log('adding episodes to playlist')
    playlist = await replaceTracksInPlaylist(tracks, playlist);

    // cleanup connections
    await disconnect();

    console.log('all done, lets exit');
    process.exit(0);
}
try {
    run();
} catch (e) {
    console.log(e);
    process.exit(1);
}

function exitOnSignal(signal) {
    process.on(signal, function () {
        console.log('\ncaught ' + signal + ', exiting');
        // disconnect();
        process.exit(1);
    });
}

exitOnSignal('SIGINT');
exitOnSignal('SIGTERM');