import { Discount } from "../models";
import { RequestHandler } from "express-serve-static-core";

const show: RequestHandler = function (req, res) {
  Discount.findAll().then((discounts) => {
    res.render("discounts", { discounts: discounts, title: "Discounts" });
  });
};
const showOne: RequestHandler = function (req, res) {
  Discount.findByPk(req.params.id).then((discount) => {
    res.render("discount", { discount: discount, title: "Discount" });
  });
};
const create: RequestHandler = function (req, res) {
  Discount.create(req.body);
  res.redirect("/discounts");
};
const edit: RequestHandler = function (req, res) {
  Discount.update(req.body, { where: { id: req.params.id } });
  res.redirect("/discounts");
};

export default { show, showOne, create, edit };
