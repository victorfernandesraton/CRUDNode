const {db} = require('../config/env');
const conection = async () => {
    try {
        const client = await mongodb.MongoClient.connect(db.uri, {
            useNewUrlParser: true,
        });
        return client
    } catch (error) {
        throw error;
    }
};

module.exports = conection