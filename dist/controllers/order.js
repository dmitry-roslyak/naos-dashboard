"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../core/models");
const controller = {
    findAll: function (req, res, next) {
        models_1.Order.findAll({
            offset: res.locals.offset,
            limit: res.locals.limit
        }).then(orders => {
            models_1.Order.count().then(total => {
                // orders.forEach(order => order.name = "**** ****")
                res.render("orders", {
                    orders: orders,
                    total: total,
                    title: "Orders"
                });
            });
        });
    },
    findById: function (req, res, next) {
        models_1.Order.findOne({ where: { id: 1 } }).then(orders => {
            res.render("users", { order: orders });
            // res.send(project);
        });
    }
};
exports.orderController = controller;
exports.default = controller;
//# sourceMappingURL=order.js.map