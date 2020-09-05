const conection = require("../database/mongodb.config");

const index = async ({ limit = 10, offset = 0, filter = {} }) => {
    const client = await conection();
    try {
        const collection = client.db('api').collection('user');
        const data = await collection
            .find(filter)
            .skip(offset)
            .limit(limit)
            .toArray();
        return data;
    } catch (error) {
        throw new Error(error)
    } finally {
        await client.close()
    }
};

const store = async ({ user = null }) => {
    if (!user) {
        throw new Error("user is required");
    }
    const client = await conection();
    try {
        const collection = client.db('api').collection('user');
        const record = await collection.insertOne({...user})
        const data = await index({})
        return data
    } catch (error) {
        throw new Error(error)
    } finally {
        client.close()
    }

};

module.exports = {
    index,
    store
};
