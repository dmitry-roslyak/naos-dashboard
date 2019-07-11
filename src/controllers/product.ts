import { NextFunction, Response, Request } from "express";
import { Product, Discount, Spec, Category } from "../core/models";
import { Op, Sequelize } from "sequelize";
import { imageUpload } from "../core/naos_api";
import * as _ from "lodash";

const controller = {
    create: function (req: Request, res: Response, next: NextFunction) {
        let product = Product.build({
            rating: 0,
            vote_count: 0,
            is_visible: true,
        });
        controller.showOne(req, res, next, product);
    },
    showOne: function (req: Request, res: Response, next: NextFunction, product: Product = null) {
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
    },
    updateOrCreate: function (req: Request, res: Response, next: NextFunction) {
        let fields = req.body;
        let imageUploadPromise = req.file && imageUpload(req)

        Object.keys(fields).forEach(name => name == "specs" || Array.isArray(fields[name]) && (fields[name] = fields[name][0]));
        fields.Specs = Object.values(fields.specs)
        fields.Specs = fields.Specs.filter((element: any) => element.value.length > 0);
        // console.log(fields)
        if (imageUploadPromise) {
            imageUploadPromise.then(function (fileName: string) {
                fields.img_src = fileName;
                console.log(fileName);
                updateOrCreate();
            }).catch(function (error) {
                res.status(500).send(error.message);
            })
        } else updateOrCreate();

        function updateOrCreate() {
            Product.createOrUpdateWithSpecs(fields).then((result) => {
                // console.log(result)
                setTimeout(() => {
                    if (fields.id) {
                        console.log(`Product (id: ${fields.id}) updated`);
                        res.redirect(".");
                    } else {
                        console.log(`Product created`);
                        res.redirect("/product/" + result[0].id);
                    }
                }, 50);
            }).catch(err => {
                console.error(err)
                res.status(400).send(err.message);
            });
        }
    },

    find: function (req: Request, res: Response, next: NextFunction) {
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
};

export { controller as productController }
export default controller
