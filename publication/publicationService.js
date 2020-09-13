const conection = require("../database/mongodb.config");
const mongodb = require("mongodb");

const { isDate, isAfter } = require("date-fns");
const { Name } = require("../validation");

const validate = ({ name, description, autor, tag, createAt, type }) => {
    if (!name) return new Error("name is required");
    if (!autor) return new Error("autor is required");
    if (!tag || !tag.length) return new Error("tag is required");
    if (!type) return new Error("type is required");

    if (!Name(name)) return new Error(`name is not valid ${name}`);
    if (description) {
        if (!Name(description))
            return new Error(`description is not valid ${description}`);
    }

    if (createAt) {
        if (
            !isDate(new Date(createAt)) ||
            isAfter(new Date(createAt), Date.now())
        ) {
            return new Error(`createAt is not valid ${createAt}`);
        }
    }

    if (!Name(type)) return new Error(`type is not valid ${type}`);

    for (const tags of tag) {
        if (typeof tags != "string") {
            return new Error(`tag is not valid ${tags}`);
        }
    }
};

const index = async ({ limit = 10, offset = 0, filter = {} }) => {
    try {
        const client = await conection();
        try {
            const collection = client.db("api").collection("publication");
            const data = await collection
                .find(filter)
                .skip(offset)
                .limit(limit)
                .toArray();
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

const store = async ({ publication = null }) => {
    if (!publication) {
        throw new Error('publication is required');
    }

    const isNotValid = validate(publication);
    
    if (isNotValid) {
        throw new Error(isNotValid)
    }

    try {
        const client = await conection();
        try {
            const collection = client.db("api").collection("publication");
            const record = await collection.insertOne(publication);
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
            throw new Error("publication not found");
        }
        return findRecord;
    } catch (error) {
        throw new Error(error);
    }
};

const updateOne = async ({ id, publication }) => {
    if (!id) {
        throw new Error("id is requuired");
    }
    if (!publication) {
        throw new Error("publication is required");
    }
    let findRecord;

    try {
        findRecord = await findOne({ id });
    } catch (error) {
        throw new Error(error);
    }

    if (!findRecord.length) {
        throw new Error("publication not found");
    }

    try {
        const client = await conection();
        try {
            const updateRecord = await client
                .db("api")
                .collection("publication")
                .updateOne(
                    { _id: mongodb.ObjectID(id) },
                    { $set: publication },
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
        throw new Error("publication not found");
    }

    try {
        const client = await conection();
        try {
            const deleteRecord = await client
                .db("api")
                .collection("publication")
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

const addTag = async({id, tag}) => {
    throw new Error('addTag is not implemented')
}

const removeTag = async({id, tag}) => {
    throw new Error('addTag is not implemented')
}

module.exports = {
    index,
    store,
    findOne,
    updateOne,
    deleteOne,
    validate,
};