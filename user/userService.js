const mongodb = require("mongodb");
const conection = require("../database/mongodb.config");

const index = async ({ limit = 10, offset = 0, filter = {} }) => {
    const client = await conection();
    if (filter._id) {
        filter._id = mongodb.ObjectID(filter._id);
    }
    try {
        const collection = client.db("api").collection("user");
        const data = await collection
            .find({ ...filter })
            .skip(offset)
            .limit(limit)
            .toArray();
        return data;
    } catch (error) {
        throw new Error(error);
    } finally {
        await client.close();
    }
};

const store = async ({ user = null }) => {
    if (!user) {
        throw new Error("user is required");
    }
    try {
        const client = await conection();
        try {
            const collection = client.db("api").collection("user");
            const record = await collection.insertOne({ ...user });
            const data = await index({});
            return data;
        } catch (error) {
            throw new Error(error);
        } finally {
            client.close();
        }
    } catch (error) {
        throw new Error(error);
    }
};

const findOne = async ({ id }) => {
    if (!id) {
        throw new Error("id is requuired");
    }

    try {
        const findRecord = await index({
            filter: { _id: id },
        });
        if (!findRecord.length) {
            throw new Error("user not found");
        }
        return findRecord;
    } catch (error) {
        throw new Error(error);
    }
};

const updateOne = async ({ id, user }) => {
    if (!id) {
        throw new Error("id is requuired");
    }
    if (!user) {
        throw new Error("user is required");
    }
    let findRecord;

    try {
        findRecord = await findOne({ id });
    } catch (error) {
        throw new Error(error);
    }

    if (!findRecord.length) {
        throw new Error("user not found");
    }

    try {
        const client = await conection();
        try {
            const updateRecord = await client
                .db("api")
                .collection("user")
                .updateOne(
                    { _id: mongodb.ObjectID(id) },
                    { $set: user },
                    { upsert: true }
                );
            return updateRecord;
        } catch (error) {
            throw new Error(error);
        } finally {
            client.close();
        }
    } catch (error) {
        throw new Error(error);
    }
};

const deleteOne = async ({ id }) => {
    if (!id) {
        throw new Error("id is requuired");
    }
    try {
        findRecord = await findOne({ id });
    } catch (error) {
        throw new Error(error);
    }

    if (!findRecord.length) {
        throw new Error("user not found");
    }

    try {
        const client = await conection();
        try {
            const deleteRecord = await client
                .db("api")
                .collection("user")
                .deleteOne({ _id: mongodb.ObjectID(id) });
            return deleteRecord;
        } catch (error) {
            throw new Error(error);
        } finally {
            client.close();
        }
    } catch (error) {
        throw new Error(error);
    }
};

module.exports = {
    index,
    store,
    findOne,
    updateOne,
    deleteOne,
};
