import { Product } from "../../core/models";
import { Op, Sequelize } from "sequelize";
import { RequestHandler } from "express-serve-static-core";

export const find: RequestHandler = function (req, res) {
  let input =
    req.body.input || res.locals.formInput || req.params.input || "";
  let options: object;
  if (input) {
    options = {
      where: {
        name: {
          [Op.like]: `%${input}%`
        }
      }
    };
  } else {
    options = {};
  }
  Product.findAll({
    ...options,
    offset: res.locals.offset || null,
    limit: res.locals.limit || 30
  }).then(products => {
    Product.count(options).then(total => {
      res.locals.formInput = input;
      res.locals.products = products;
      res.locals.total = total;
      res.render("products", { title: "Products" });
    });
  });
}