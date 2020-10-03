const conection = require("../database/mongodb.config");
const mongodb = require("mongodb");

const { isDate, isAfter } = require("date-fns");
const { Name, Isbn } = require("../validation");

const validate = ({ name, status, isbn, description, autor, tag, createAt, type }) => {
    if (!name) return new Error("name is required");
    if (!autor) return new Error("autor is required");
    if (!type) return new Error("type is required");
    if (!isbn) return new Error('ISBN-10 or  ISBN-13 is required');
    if (createAt) {
        if (
            !isDate(new Date(createAt)) ||
            isAfter(new Date(createAt), Date.now())
        ) {
            return new Error(`createAt is not valid ${createAt}`);
        }
    }

    if (status && typeof status !== 'boolean') return new Error(`status is not valid ${status}`);

    if (!Name(type)) return new Error(`type is not valid ${type}`);

    if (tag && tag.length) {
        for (const tags of tag) {
            if (typeof tags != "string") {
                return new Error(`tag is not valid ${tags}`);
            }
        }
    }
    if (!Isbn(isbn)) return new Error(`ISBN is invalid ${isbn}`);
};

const index = async ({ limit = 10, offset = 0, filter = {} }) => {
    if (filter._id) {
        filter._id = mongodb.ObjectID(filter._id);
    }

    try {
        const client = await conection();
        try {
            const collection = client.db("api").collection("publication");
            const data = await collection
                .find(filter)
                .skip(offset)
                .limit(limit)
                .toArray();
            const total = await collection.countDocuments(filter);
            return {data, metadata: {limit, offset, total}};
        } catch (error) {
            throw new Error(error);
        } finally {
            client.close();
        }
    } catch (error) {
        throw new Error(error);
    }
};

const tagSplit = (el) => el.toString().trim().split(" ");

const store = async ({ publication = null }) => {
    if (!publication) {
        throw new Error("publication is required");
    }

    if (publication.status === null || publication.status === undefined) {
        publication.status = false
    }
    if (publication.status === 'on') {
        publication.status = true
    }

    const isNotValid = validate(publication);


    if (isNotValid) {
        throw new Error(isNotValid);
    }

    try {
        if(publication.tag && publication.tag.length> 0) {
            publication.tag = tagSplit(publication.tag)
        }
        const client = await conection();
        try {
            const collection = client.db("api").collection("publication");
            const record = await collection.insertOne(publication);
            const {data, metadata} = await index({});
            return {data, metadata};
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
        const {data, metadata} = await index({
            filter: { _id: id },
        });
        if (!data.length) {
            throw new Error("publication not found");
        }
        return {data, metadata};
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

    if (publication.status === null || publication.status === undefined) {
        publication.status = false
    }
    if (publication.status === 'on') {
        publication.status = true
    }

    try {
        findRecord = await (await findOne({ id })).data;
    } catch (error) {
        throw new Error(error);
    }

    if (!findRecord.length) {
        throw new Error("publication not found");
    }

    try {
        const client = await conection();
        const isNotValid = validate(publication);

        if(publication.tag && publication.tag.length> 0) {
            publication.tag = tagSplit(publication.tag)
        }

        if (isNotValid) {
            throw new Error(isNotValid);
        }
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
        const {data} = await findOne({ id });
        if (!data.length) {
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
    validate,
};
