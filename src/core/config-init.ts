import { Sequelize } from "sequelize";

const sequelize = new Sequelize("postgres://xnqejukodrfjox:f5e89eb6dad44e9bd48c16103a9679fdc62e56062017250cac78c359570b2577@ec2-79-125-2-142.eu-west-1.compute.amazonaws.com:5432/dcc1bqm7tm1v5v", {
    "define": {
        "underscored": true,
        "timestamps": false
    },
    "logging": false
})

export { sequelize }
export default sequelize
