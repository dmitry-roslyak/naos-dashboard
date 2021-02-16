import { Order } from "../models";
import { RequestHandler } from "express-serve-static-core";

const findAll: RequestHandler = function (req, res) {
  Order.findAll({
    offset: res.locals.offset,
    limit: res.locals.limit,
  }).then((orders) => {
    Order.count().then((total) => {
      !process.env.isUserNamesVisible && orders.forEach((order) => (order.name = "**** ****"));
      res.render("orders", {
        orders: orders,
        total: total,
        title: "Orders",
      });
    });
  });
};
const findById: RequestHandler = function (req, res) {
  Order.findOne({ where: { id: 1 } }).then((orders) => {
    res.render("users", { order: orders });
    // res.send(project);
  });
};

export default { findAll, findById };
