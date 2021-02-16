import _ = require("lodash");
import { FindOptions, Op, Sequelize } from "sequelize";
import { Category, Discount, Product, ProductHistory, Spec } from "../models";

export class ProductService {
  static search(input: number, offset: number, limit: number) {
    let options: FindOptions;
    if (input) {
      options = {
        where: {
          name: {
            [Op.iLike]: `%${input}%`,
          },
        },
        // raw: true,
      };
    } else {
      options = {
        // raw: true,
      };
    }

    return Promise.all([
      Product.findAll({
        ...options,
        offset,
        limit,
        include: [ProductHistory],
        order: [
          ["id", "ASC"],
          [ProductHistory, "date", "DESC"],
        ],
      }),
      Product.count(options),
    ]);
  }
  //update create, then remove
  static createV1old() {
    return Product.build({
      name: "Test",
      price: 101.93,
      rating: 0,
      vote_count: 0,
      is_visible: true,
      available: 10,
    });
  }
  static showOne(id: number) {
    let p0: Array<Promise<any> | Product> = [];
    p0.push(
      Product.findByPk(id, {
        include: [Discount, Spec],
        raw: true,
      })
    );
    p0.push(Discount.findAll());
    p0.push(Category.findAll());
    p0.push(
      Spec.findAll({
        attributes: [[Sequelize.fn("DISTINCT", Sequelize.col("name")), "name"], "value", "val_type"],
        raw: true,
      })
    );

    return Promise.all(p0).then(([product, discounts, categories, specs]) => {
      const spec_values = _.groupBy(specs, (object) => object.name);
      const s2 = _.uniqBy(specs, (object: any) => object.name);
      return {
        product,
        discounts,
        categories,
        specs: s2,
        spec_values: spec_values,
        title: "Product",
      };
    });
  }
  static async updateOrCreate(fields: any, fileName: Promise<any>) {
    Object.keys(fields).forEach(
      (name) => name == "specs" || (Array.isArray(fields[name]) && (fields[name] = fields[name][0]))
    );

    fields.Specs = Object.values(fields.specs);
    fields.Specs = fields.Specs.filter((element: any) => element.value.length > 0);
    fields.img_src = (await fileName) || "";

    return Product.createOrUpdateWithSpecs(fields);
  }
}
