"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models");
const findAll = function (req, res) {
    models_1.Order.findAll({
        offset: res.locals.offset,
        limit: res.locals.limit,
    }).then((orders) => {
        models_1.Order.count().then((total) => {
            !process.env.isUserNamesVisible && orders.forEach((order) => (order.name = "**** ****"));
            res.render("orders", {
                orders: orders,
                total: total,
                title: "Orders",
            });
        });
    });
};
const findById = function (req, res) {
    models_1.Order.findOne({ where: { id: 1 } }).then((orders) => {
        res.render("users", { order: orders });
        // res.send(project);
    });
};
exports.default = { findAll, findById };
//# sourceMappingURL=order.js.map