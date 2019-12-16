import { Product, Discount, Spec, Category } from "../../core/models";
import { NextFunction, Response, Request } from "express";
import { Op, Sequelize } from "sequelize";
import * as _ from "lodash";

export const showOne = function (req: Request, res: Response, next: NextFunction, product: Product = null) {
  let p0: Array<Promise<any> | Product> = [];
  p0.push(product || Product.findByPk(req.params.id, {
    include: [Discount, Spec]
  }));
  p0.push(Discount.findAll());
  p0.push(Category.findAll());
  p0.push(Spec.findAll({
    attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('name')), 'name'], 'value', 'val_type'],
    raw: true
  }));

  Promise.all(p0).then(([product, discounts, categories, specs]) => {
    let spec_values = _.groupBy(specs, object => object.name)
    let s2 = _.uniqBy(specs, (object: any) => object.name)

    // console.log(product)
    res.render("product", {
      product: product,
      discounts: discounts,
      categories: categories,
      specs: s2,
      spec_values: spec_values,
      title: "Product"
    });
  });
}