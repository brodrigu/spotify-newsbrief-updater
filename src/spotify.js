import SpotifyWebApi from 'spotify-web-api-node';
import fetch from 'node-fetch';
import moment from 'moment';
import { URLSearchParams } from 'url';
import { getTokens, updateTokens } from './mongo';

// pull these out before comitting
export const clientId = process.env.SPOTIFY_CLIENT_ID;
export const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
export const redirectUri = 'http://localhost:8080';

const twoDaysAgo = moment().subtract(2, 'days');
// credentials are optional
var spotifyApi = new SpotifyWebApi({
  clientId,
  clientSecret,
  redirectUri
});

export const authenticate = async () => {
    // get tokens from mongo
    const tokens = await getTokens();

    // get refresh token from spotify
    const newTokens = await getTokensFromRefreshToken(tokens.refresh_token);

    // update tokens back in mongo
    await updateTokens(newTokens);

    // save in memory for use in script
    spotifyApi.setAccessToken(newTokens.access_token);
}

export const getTokensFromCode = async(code) => {
    const params = new URLSearchParams();
    params.append('grant_type', 'authorization_code');
    params.append('code', code);
    params.append('redirect_uri', redirectUri);
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
}

export const getTokensFromRefreshToken = async(refreshToken) => {
    const params = new URLSearchParams();
    params.append('grant_type', 'refresh_token');
    params.append('refresh_token', refreshToken);
    params.append('redirect_uri', redirectUri);
    params.append('client_id', clientId);
    params.append('client_secret', clientSecret);

    const result = await fetch(`https://accounts.spotify.com/api/token`, {
        method: 'post',
        body: params,

    });
    const newTokens = await result.json();
    return newTokens;
}

export const getPlaylist = async () => {
    const result = await spotifyApi.searchPlaylists('News Brief')
    const detailedResult = await spotifyApi.getPlaylist(result.body.playlists.items[0].id);
    return detailedResult.body;
}

export const getPodcastEpisodes = async() => {
    let episodes = [
        // NPR News Now
        ...await getMostRecentEpisode(
            await getEpisodesForShow('6BRSvIBNQnB68GuoXJRCnQ')
        ),
        // LA Times Daily
        ...await getEpisodesFromLast24Hours(
            await getEpisodesForShow('2kAhG92Z7trgwJ96pYGaug')
        ),
        // KQED California Report
        ...await getEpisodesFromLast24Hours(
            await getEpisodesForShow('32ADB4Q1RuNcTHrJ6lQ5lX')
        ),
        // California News
        ...await getEpisodesFromLast24Hours(
            await getEpisodesForShow('2n3aTri7X8xPUtGRASQU5n')
        ),
        // KQED The Bay
        ...await getEpisodesFromLast24Hours(
            await getEpisodesForShow('4BIKBKIujizLHlIlBNaAqQ')
        ),
        // NJ 101.5
        ...await getMostRecentEpisode(
            await getEpisodesForShow('7r4QpkJcuUV0nTHvXawf4F')
        ),
        // CBS Philly dondondondondondondondondondon
        ...await getMostRecentEpisode(
            await getEpisodesForShow('44rDzuxs6qJR7p1Gun3SL8')
        ),
    ]
    return episodes;
}

const getEpisodesForShow = async (showId) => {
    try {
        const result = await spotifyApi.getShow(showId);
        return result.body.episodes.items;
    } catch (e) {
        console.log(`could not find show ${showId}`)
        return [];
    }
}

const getMostRecentEpisode = (episodes) => {
    if (!episodes.length) {
        return [];
    }
    if (twoDaysAgo.isBefore(episodes[0].release_date)) {
        return [episodes[0]];
    }
    return [];
}

const getEpisodesFromLast24Hours = (episodes) => {
    return episodes.filter(episode => twoDaysAgo.isBefore(episode.release_date));
}

export const emptyPlaylist = async (playlist) => {
    if (!playlist.tracks.items.length) {
        return playlist;
    }
    await spotifyApi.removeTracksFromPlaylist(playlist.id, playlist.tracks.items.filter(item => item.track).map(item => item.track));
    return await getPlaylist();
}

export const addTracksToPlaylist = async (tracks, playlist) => {
    await spotifyApi.addTracksToPlaylist(playlist.id, tracks.map(track => track.uri));
    return await getPlaylist();
}

