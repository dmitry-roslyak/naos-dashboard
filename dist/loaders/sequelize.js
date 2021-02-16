"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
let sequelizeDefaultOptions = {
    define: {
        underscored: true,
        timestamps: false,
    },
    logging: false,
};
if (process.env.SSL_ENABLED == "true") {
    sequelizeDefaultOptions["dialectOptions"] = {
        ssl: true,
    };
}
if (!process.env.DATABASE_URL)
    throw "DATABASE_URL is undefined";
exports.sequelize = new sequelize_1.Sequelize(process.env.DATABASE_URL, sequelizeDefaultOptions);
exports.sequelize.authenticate().then(() => console.log("Sequelize connected"));
//# sourceMappingURL=sequelize.js.map