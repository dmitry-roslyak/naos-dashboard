import { Router } from "express";
import { Order, User } from "../models";

const router = Router();

router.get("/", function (req, res) {
  res.render("index.pug", {
    server: { url: process.env.NAOS_URL, status: 200 },
    title: "Naos dashboard",
  });
});

router.get("/orders", function (req, res) {
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
});

router.get("/users", function (req, res) {
  User.findAll({
    offset: res.locals.offset,
    limit: res.locals.limit,
  }).then((users) => {
    !process.env.isUserNamesVisible && users.forEach((user) => (user.name = "**** ****"));

    if (req.headers["content-type"] == "application/json") {
      res.send(users);
    } else {
      User.count().then((total) =>
        res.render("users", {
          users: users,
          total: total,
          title: "Users",
        })
      );
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

export { router as indexRouter };
export default router;
