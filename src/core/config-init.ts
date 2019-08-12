import { Sequelize } from "sequelize";

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    "define": {
        "underscored": true,
        "timestamps": false
    },
    "logging": false
})

export { sequelize }
export default sequelize
