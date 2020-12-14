# spotify-newsbrief-updater

## Run locally
Make sure to set env variables for:
```
SPOTIFY_CLIENT_ID
SPOTIFY_CLIENT_SECRET
MONGO_USERNAME
MONGO_PASSWORD
```

Then run:

```
npm install
npm start
```

## Run using Docker
Create an env file:

```
cat "SPOTIFY_CLIENT_ID=MySecretId
SPOTIFY_CLIENT_SECRET=MySecretPassword
MONGO_USERNAME=myMongoUsername
MONGO_PASSWORD=myMongoPassword" >> local.env
```

then run:

```
docker build -t spotify-newsbrief-updater . && docker run --env-file=local.env spotify-newsbrief-updater
```