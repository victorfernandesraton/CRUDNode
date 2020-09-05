const path = require('path');

require('dotenv').config({
    path: path.resolve('../','.env')
})

module.exports = {
    db: {
        uri: `${process.env.DATABASE_DOMAIN}://${process.env/DATABASE_HOST}:${process.env/DATABASE_PORT}`
    },
    server: {
        port: process.env.PORT
    }
}