const Sequelize = require("sequelize");

const {
    NAOS_API_TOKEN,
    NAOS_URL,
    DATABASE_URL
} = require("../../config/general.json");
process.env.NAOS_API_TOKEN = NAOS_API_TOKEN;
process.env.NAOS_URL = NAOS_URL;
DATABASE_URL && (process.env.DATABASE_URL = DATABASE_URL);

let sequelize;
if (process.env.DATABASE_URL) {
    sequelize = new Sequelize(process.env.DATABASE_URL);
} else {
    const {
        database,
        username,
        password,
        options
    } = require("../../config/db.json");
    sequelize = new Sequelize(database, username, password, options);
}
module.exports = { sequelize };
