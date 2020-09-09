const conection = require("../database/mongodb.config");
const mongodb = require("mongodb");

const validator = require("validator");
const { isDate, isAfter } = require("date-fns");

const { Cep, Cpf, Name, Phone } = require("../validation/");

const validate = ({
    mail,
    firstname,
    lastname,
    cpf,
    birth,
    gender,
    cep,
    status,
    phone,
}) => {
    // if (!mail) {
    //     return new Error("mail is required");
    // }

    // if (!validator.default.isEmail(mail)) {
    //     return new Error(`mail not valid ${mail}`);
    // }

    if (!cpf) {
        return new Error(`cpf is required ${mail}`);
    }

    if (!Cpf(cpf)) {
        return new Error(`cpf not valid ${cpf}`);
    }

    if (!firstname) {
        return new Error(`name is required ${mail}`);
    }

    if (!Name(firstname)) {
        return new Error(`name not valid ${firstname}`);
    }

    if (!lastname) {
        return new Error(`lastname is required ${lastname}`);
    }

    if (!Name(lastname)) {
        return new Error(`lastname not valid ${lastname}`);
    }

    // if (!isDate(new Date(birth))) {
    //     return new Error(`birth(date) is required ${birth}`);
    // }

    // if (isAfter(new Date(birth), new Date(Date.now()))) {
    //     return new Error(`birth(date) is after than today ${birth}`);
    // }

    // if (!cep) {
    //     return new Error("cep is required");
    // }

    // if (!Cep(cep)) {
    //     return new Error("cep is not valid");
    // }

    // if (!gender) {
    //     return new Error("gender is required");
    // }

    // if (gender != "w" && gender != "m") {
    //     return new Error(`gender is not valid ${gender}`);
    // }

    // if (typeof status != "boolean") {
    //     return new Error("status not valid");
    // }

    // if (!phone) {
    //     return new Error("phone is request");
    // }

    // if (!Phone(phone)) {
    //     return new Error("phone not valid");
    // }
};

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
    const isValud = validate({...user});

    if (isValud) {
        throw new Error(isValud)
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
    validate,
};
