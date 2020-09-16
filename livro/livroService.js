const conection = require("../database/mongodb.config");
const mongodb = require("mongodb");

const validator = require("validator");
const { isDate, isAfter } = require("date-fns");

const { Cep, Cpf, Name, Phone } = require("../validation/");

const validate = ({
    titulo,
    descricao,
    editora,
    data,
    assunto
}) => {
    

    //if (!titulo) {
       // return new Error(`name is required ${titulo}`);
   // }

    if (!Name(titulo)) {
        return new Error(`name not valid ${titulo}`);
    }

    if (!descricao) {
        return new Error(`lastname is required ${descricao}`);
    }

    if (!Name(descricao)) {
        return new Error(`lastname not valid ${descricao}`);
    }

    
};

const index = async ({ limit = 10, offset = 0, filter = {} }) => {
    const client = await conection();
    if (filter._id) {
        filter._id = mongodb.ObjectID(filter._id);
    }
    try {
        const collection = client.db("api").collection("livro");
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

const store = async ({ livro = null }) => {
    if (!livro) {
        throw new Error("erro aqui");
    }
    const isValud = validate({...livro});

    if (isValud) {
        throw new Error(isValud)
    }
    
    try {
        const client = await conection();
        try {
            const collection = client.db("api").collection("livro");
            const record = await collection.insertOne({ ...livro });
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
            throw new Error("book not found");
        }
        return findRecord;
    } catch (error) {
        throw new Error(error);
    }
};

const updateOne = async ({ id, livro }) => {
    if (!id) {
        throw new Error("id is requuired");
    }
    if (!livro) {
        throw new Error("book is required");
    }
    let findRecord;

    try {
        findRecord = await findOne({ id });
    } catch (error) {
        throw new Error(error);
    }

    if (!findRecord.length) {
        throw new Error("book not found");
    }

    try {
        const client = await conection();
        try {
            const updateRecord = await client
                .db("api")
                .collection("livro")
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
        throw new Error("book not found");
    }

    try {
        const client = await conection();
        try {
            const deleteRecord = await client
                .db("api")
                .collection("livro")
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
