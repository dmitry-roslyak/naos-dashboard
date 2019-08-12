"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize = new sequelize_1.Sequelize(process.env.DATABASE_URL, {
    "define": {
        "underscored": true,
        "timestamps": false
    },
    "logging": false
});
exports.sequelize = sequelize;
exports.default = sequelize;
//# sourceMappingURL=config-init.js.map