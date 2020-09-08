const app = require("./app");
const httpServer = require("http").createServer(app);

const mongodb = require("mongodb");
const { db, server } = require("./config/env");

const client = mongodb.MongoClient;
console.log(db.uri)
client.connect(
    db.uri,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    },
    (err, database) => {
        if (err) throw new Error(err);
        console.log(`databse has connected ${db.uri}`);
        database.close();
    }
);

httpServer.on("listening", () => {
    console.info(`server us rub in port ${server.port} Press Ctrl + C to exit`);
});

httpServer.listen(server.port);
