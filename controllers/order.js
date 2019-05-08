const Order = require("../core/models").Order;

module.exports = {
    findAll: function (req, res, next) {
        Order.findAll({
            offset: res.locals.offset,
            limit: res.locals.limit
        }).then(orders => {
            Order.count().then(total => {
                // orders.forEach(order => order.name = "**** ****")
                res.render("orders", {
                    orders: orders,
                    total: total,
                    title: "Orders"
                })
            });
        });
    },
    findById: function (req, res, next) {
        Order.findOne({ where: { id: 1 } }).then(orders => {
            res.render("users", { order: orders });
            // res.send(project);
        });
    }
};
