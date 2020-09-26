const app = require("./app");
const httpServer = require("http").createServer(app);

const mongodb = require("mongodb");
const { db, server } = require("./config/env");

const client = mongodb.MongoClient;

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
    console.info(`Server is run in ${require('os').hostname()} http://${httpServer.address().address}:${httpServer.address().port} Press Ctrl + C to exit`);
});

httpServer.listen(server.port, '127.0.0.1');
