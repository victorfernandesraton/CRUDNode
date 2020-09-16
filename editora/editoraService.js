const conection = require("../database/mongodb.config");
const mongodb = require("mongodb");

const validator = require("validator");
const { isDate, isAfter } = require("date-fns");

const { Cep, Cnpj, Razao, Phone, Cpf } = require("../validation/");

const validate = ({
    mail,
    razao,
    nome,
    cnpj,
    phone,
}) => {
    if (!cpnj) {
        return new Error(`cnpj is required`);
    }

    if (!Cnpj(cnpj)) {
        return new Error(`cnpj not valid ${cnpj}`);
    } 

    if (!razao) {
        return new Error(`razao is required ${razao}`);
    }

    if (!razao) {
        return new Error(`razao not valid ${razao}`);
    }

    if (!nome) {
        return new Error(`razao not valid ${nome}`);
    }
}

const index = async ({ limit = 10, offset = 0, filter = {} }) => {
    const client = await conection();
    if (filter._id) {
        filter._id = mongodb.ObjectID(filter._id);
    }
    try {
        const collection = client.db("api").collection("editora");
        const data = await collection
            .find({ ...filter })
            .skip(offset)
            .limit(limit)
            .toArray();
        return data;
    } catch (error) {
        throw new Error(error);
    }finally {
        await client.close();
    }
};

const store =  async ({ editora = null}) => {
    if (!editora) {
        throw new Error("editora is required");
    }
    const isValud = validate({ ...editora});

    if (isValud) {
        throw new Error(isValud)
    }

    try {
        const client = await conection();
        try {
            const cllection = client.db("api").collection("editora");
            const record = await collection.insertOne({ ...editora });
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
        throw new Error("id is required");
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

const updateOne = async ({ id, editora }) => {
    if (!id) {
        throw new Error("id is required");
    }
    if (!editora) {
        throw new Error("editora is required");
    }
    let findRecord;

    try {
        findRecord = await findOne({ id });
    } catch (error) {
        throw new Error(error);
    }

    if (!findRecord.length) {
        throw new Error("editora not found");
    }

    try {
        const client = await conection();
        try {
            const updateRecord = await client
                .db("api")
                .collection("editora")
                .updateOne(
                    { _id: mongodb.ObjectID(id) },
                    { $set: editora },
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
        throw new Error("id is required");
    }
    try {
        findRecord = await findOne({ id });
    } catch (error) {
        throw new Error(error);
    }

    if (!findRecord.length) {
        throw new Error("editora not found");
    }

    try {
        const client = await conection();
        try {
            const deleteRecord = await client
                .db("api")
                .collection("editora")
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
    validate,
};