# spotify-newsbrief-updater

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