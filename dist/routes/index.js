"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const models_1 = require("../models");
const router = express_1.Router();
exports.indexRouter = router;
router.get("/", function (req, res) {
    res.render("index.pug", {
        server: { url: process.env.NAOS_URL, status: 200 },
        title: "Naos dashboard",
    });
});
router.get("/orders", function (req, res) {
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
});
router.get("/users", function (req, res) {
    models_1.User.findAll({
        offset: res.locals.offset,
        limit: res.locals.limit,
    }).then((users) => {
        !process.env.isUserNamesVisible && users.forEach((user) => (user.name = "**** ****"));
        if (req.headers["content-type"] == "application/json") {
            res.send(users);
        }
        else {
            models_1.User.count().then((total) => res.render("users", {
                users: users,
                total: total,
                title: "Users",
            }));
        }
    });
});
router.get("/delete", function (req, res, next) {
    res.render("deleteWarning", {
        item: {
            category: req.query.itemCategory,
            id: req.query.id,
        },
        href: req.query.href,
    });
});
exports.default = router;
//# sourceMappingURL=index.js.map