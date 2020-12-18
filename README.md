# spotify-newsbrief-updater
Manages a Spotify playlist of short news podcasts including only recent episodes. Includes github action to refresh playlist at relevant intervals.

Created podcast can be viewed here: https://open.spotify.com/playlist/1VG3YBqrsJdFApjL7ZUmTt?si=zoRJgKrgTcSrVTaresWrCA

## Setup Env
Create an env file:

```
cat "SPOTIFY_CLIENT_ID=MySecretId
SPOTIFY_CLIENT_SECRET=MySecretPassword
MONGO_USERNAME=myMongoUsername
MONGO_PASSWORD=myMongoPassword" >> local.env
```

## Run locally

```
source local.env
npm install
npm start
```

## Run using Docker

```
docker build -t spotify-newsbrief-updater . && docker run --env-file=local.env spotify-newsbrief-updater
```
