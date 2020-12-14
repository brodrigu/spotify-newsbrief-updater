import express from 'express';
import fetch from 'node-fetch';
import { URLSearchParams } from 'url';
import { clientId, clientSecret } from './spotify';
const server = express();

let port = 8080;
const redirectUrl = `http://localhost:${port}/return`;

server.get('/', async (req, res) => {
    const scopes = 'playlist-modify-public,playlist-modify-private,user-library-modify,playlist-read-private,user-library-read';
    const url = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUrl}&scope=${scopes}`;
    console.log('redirecting to: ', url);
    res.redirect(url);
});

server.get('/return', async (req, res) => {
    // console.log('made it back', req);
    
    if (req.query.error) {
        console.log('error: ', error);
        res.send(error);
    }
    if (!req.query.code) {
        console.log('not sure why, but we dont have a code');
        res.send('no code');
    }

    const params = new URLSearchParams();
    params.append('grant_type', 'authorization_code');
    params.append('code', req.query.code);
    params.append('redirect_uri', redirectUrl);
    params.append('client_id', clientId);
    params.append('client_secret', clientSecret);

    fetch(`https://accounts.spotify.com/api/token`, {
        method: 'post',
        body: params,

    })
        .then(res => res.json())
        .then(json => {
            console.log('response:', json)
            res.send(JSON.stringify(json))
        });
    
});

if (parseInt(process.argv[2], 10) > 0) {
    port = Number(process.argv[2]);
}

server.listen(port, () => {
    console.log(`listening at http://localhost:${port}`);
});

function exitOnSignal(signal) {
    process.on(signal, function () {
        console.log('\ncaught ' + signal + ', exiting');
        process.exit(1);
    });
}

exitOnSignal('SIGINT');
exitOnSignal('SIGTERM');