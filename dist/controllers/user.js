"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../core/models");
const findAll = function (req, res) {
    models_1.User.findAll({
        offset: res.locals.offset,
        limit: res.locals.limit
    }).then(users => {
        !process.env.isUserNamesVisible && users.forEach(user => user.name = "**** ****");
        models_1.User.count().then(total => res.render("users", {
            users: users,
            total: total,
            title: "Users"
        }));
    });
};
exports.default = { findAll };
//# sourceMappingURL=user.js.map