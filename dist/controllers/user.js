"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../core/models");
const controller = {
    findAll: function (req, res, next) {
        models_1.User.findAll({
            offset: res.locals.offset,
            limit: res.locals.limit
        }).then(users => {
            models_1.User.count().then(total => res.render("users", {
                users: users,
                total: total,
                title: "Users"
            }));
        });
    }
};
exports.userController = controller;
exports.default = controller;
//# sourceMappingURL=user.js.map