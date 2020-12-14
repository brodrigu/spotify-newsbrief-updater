import { MongoClient } from 'mongodb';

const mongoUser = process.env.MONGO_USERNAME;
const mongoPass = process.env.MONGO_PASSWORD;

const dbName = 'state';
const mongoUrl = `mongodb+srv://${mongoUser}:${mongoPass}@cluster0.wqqd9.mongodb.net/${dbName}?retryWrites=true&w=majority`;
let mClient;

export const connect = async () => {
    mClient = await MongoClient.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Connected successfully to server");
};

export const disconnect = async () => {
    return mClient.close();
};

export const getTokens = async () => {
    const db = mClient.db(dbName);
    const collection = db.collection('spotify-tokens');
    const tokens = await collection.findOne();
    return tokens;
}
export const updateTokens = async (updatedTokens) => {
    const db = mClient.db(dbName);
    const collection = db.collection('spotify-tokens');
    const result = await collection.updateOne({ token_type: 'Bearer' }, { $set: updatedTokens });
    return result;
}
