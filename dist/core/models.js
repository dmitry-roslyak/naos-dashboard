"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const config_init_1 = require("./config-init");
class Spec extends sequelize_1.Model {
}
exports.Spec = Spec;
class Category extends sequelize_1.Model {
}
exports.Category = Category;
class Order extends sequelize_1.Model {
}
exports.Order = Order;
class User extends sequelize_1.Model {
}
exports.User = User;
class Discount extends sequelize_1.Model {
}
exports.Discount = Discount;
class Product extends sequelize_1.Model {
    static createOrUpdateWithSpecs(fields) {
        return config_init_1.default.transaction(t => {
            let array = [];
            if (fields.id) {
                Product.findByPk(fields.id, {
                    include: [Spec]
                }).then(product => {
                    product.Specs.forEach(spec => {
                        array.push(spec.update(fields.specs[spec.name]));
                    });
                    array.push(product.update(fields));
                });
            }
            else {
                array.push(Product.create(fields, {
                    include: [Spec]
                }));
            }
            return Promise.all(array);
        });
    }
}
exports.Product = Product;
Spec.init({
    id: { type: sequelize_1.DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    prod_id: { type: sequelize_1.DataTypes.INTEGER },
    name: sequelize_1.DataTypes.STRING,
    value: sequelize_1.DataTypes.STRING,
    val_type: sequelize_1.DataTypes.STRING,
    category: { type: sequelize_1.DataTypes.STRING, defaultValue: "basic" },
    isComparable: { type: sequelize_1.DataTypes.BOOLEAN, defaultValue: false, field: "isComparable" },
    isFilterable: { type: sequelize_1.DataTypes.BOOLEAN, defaultValue: false, field: "isFilterable" }
}, { sequelize: config_init_1.default });
Category.init({
    name: sequelize_1.DataTypes.STRING
}, { sequelize: config_init_1.default });
Order.init({
    id: { type: sequelize_1.DataTypes.INTEGER, primaryKey: true },
    name: sequelize_1.DataTypes.STRING,
    price: sequelize_1.DataTypes.DOUBLE,
    currency_type: sequelize_1.DataTypes.STRING,
    deliver_adr: sequelize_1.DataTypes.STRING,
    payment_type: sequelize_1.DataTypes.STRING,
    payment_state: sequelize_1.DataTypes.STRING,
    order_state: sequelize_1.DataTypes.STRING,
    created_at: sequelize_1.DataTypes.DATE,
    updated_at: sequelize_1.DataTypes.DATE
}, { sequelize: config_init_1.default });
User.init({
    id: { type: sequelize_1.DataTypes.INTEGER, primaryKey: true },
    name: sequelize_1.DataTypes.STRING,
    currency: sequelize_1.DataTypes.STRING,
    language: sequelize_1.DataTypes.STRING,
    created_at: sequelize_1.DataTypes.DATE,
    updated_at: sequelize_1.DataTypes.DATE
}, { sequelize: config_init_1.default });
Discount.init({
    promo_code: sequelize_1.DataTypes.STRING,
    discount: sequelize_1.DataTypes.INTEGER,
    begin_at: sequelize_1.DataTypes.DATE,
    end_at: sequelize_1.DataTypes.DATE
}, { sequelize: config_init_1.default });
Product.init({
    category_id: { type: sequelize_1.DataTypes.INTEGER },
    discount_id: { type: sequelize_1.DataTypes.INTEGER },
    name: sequelize_1.DataTypes.STRING,
    description: sequelize_1.DataTypes.STRING,
    img_src: sequelize_1.DataTypes.STRING,
    price: sequelize_1.DataTypes.DOUBLE,
    rating: sequelize_1.DataTypes.DOUBLE,
    vote_count: sequelize_1.DataTypes.INTEGER,
    is_visible: sequelize_1.DataTypes.BOOLEAN,
    is_bestseller: sequelize_1.DataTypes.BOOLEAN,
    available: sequelize_1.DataTypes.INTEGER,
    arrive_date: sequelize_1.DataTypes.DATE,
    created_at: sequelize_1.DataTypes.DATE,
    updated_at: sequelize_1.DataTypes.DATE
}, { sequelize: config_init_1.default });
// sequelize
//     .sync()
//     .then(() =>
//         User.create({
//             name: "janedoe"
//             // birthday: new Date(1980, 6, 20)
//         })
//     )
//     .then(jane => {
//         console.log(jane.toJSON());
//     });
Product.belongsTo(Discount);
Product.hasMany(Spec, { foreignKey: "prod_id", constraints: false });
exports.default = { Product, Discount, User, Order, Category, Spec };
//# sourceMappingURL=models.js.map