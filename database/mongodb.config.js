const mongodb = require("mongodb");
const { db } = require("../config/env");

const conection = async () => {
    try {
        const client = await mongodb.MongoClient.connect(db.uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        return client;
    } catch (error) {
        throw error;
    }
};

module.exports = conection;
