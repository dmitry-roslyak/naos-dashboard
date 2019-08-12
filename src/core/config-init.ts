import { Sequelize } from "sequelize";

const {
    NAOS_API_TOKEN,
    NAOS_URL,
    DATABASE_URL,
    isUserNamesVisible,
    sequelizeConfig
} = require("../../config.json");

!process.env.NAOS_API_TOKEN && NAOS_API_TOKEN && (process.env.NAOS_API_TOKEN = NAOS_API_TOKEN);
!process.env.NAOS_URL && NAOS_URL && (process.env.NAOS_URL = NAOS_URL);
!process.env.DATABASE_URL && DATABASE_URL && (process.env.DATABASE_URL = DATABASE_URL);
!process.env.isUserNamesVisible && isUserNamesVisible && (process.env.isUserNamesVisible = isUserNamesVisible);

const sequelize = process.env.DATABASE_URL ?
    new Sequelize(process.env.DATABASE_URL) :
    new Sequelize(sequelizeConfig.database, sequelizeConfig.username, sequelizeConfig.password, sequelizeConfig.options);

export { sequelize }
export default sequelize
