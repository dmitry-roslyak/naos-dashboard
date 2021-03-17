import _ = require("lodash");
import { FindOptions, Op, Sequelize } from "sequelize";
import { sequelize } from "../loaders/sequelize";
import { Category, Discount, Link, Product, ProductHistory, Spec } from "../models";

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
        include: [ProductHistory, Link],
        order: [
          ["id", "ASC"],
          [ProductHistory, "date", "DESC"],
        ],
      }),
      Product.count(options),
    ]);
  }

  static showOne(id: number) {
    let p0: Array<Promise<any> | Product> = [];
    p0.push(
      Product.findByPk(id, {
        include: [Discount, Spec, Link],
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

  static create(fields: any) {
    return Product.create(fields, {
      include: [Link],
    });
  }

  static update(fields: any) {
    return Promise.all([
      fields.id &&
        Product.findByPk(fields.id).then((product) => {
          return product.update(fields);
        }),
      fields.Links && this.updateLink(fields.content_ids, fields.Links),
    ]);
  }

  static updateLink(content_ids: string[], links: any) {
    return sequelize.transaction((t) => {
      return Promise.all([
        Link.destroy({
          where: {
            content_ids: content_ids,
          },
        }),
        Link.bulkCreate(links),
      ]);
    });
  }

  static deleteLink(linkId: string | number) {
    return Link.destroy({
      where: {
        id: linkId,
      },
    });
  }
}
