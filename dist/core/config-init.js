"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const { NAOS_API_TOKEN, NAOS_URL, DATABASE_URL, sequelizeConfig } = require("../../config.json");
!process.env.NAOS_API_TOKEN && NAOS_API_TOKEN && (process.env.NAOS_API_TOKEN = NAOS_API_TOKEN);
!process.env.NAOS_URL && NAOS_URL && (process.env.NAOS_URL = NAOS_URL);
!process.env.DATABASE_URL && DATABASE_URL && (process.env.DATABASE_URL = DATABASE_URL);
const sequelize = process.env.DATABASE_URL ?
    new sequelize_1.Sequelize(process.env.DATABASE_URL) :
    new sequelize_1.Sequelize(sequelizeConfig.database, sequelizeConfig.username, sequelizeConfig.password, sequelizeConfig.options);
exports.sequelize = sequelize;
exports.default = sequelize;
//# sourceMappingURL=config-init.js.map