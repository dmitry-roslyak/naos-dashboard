"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize_2 = require("./loaders/sequelize");
class Spec extends sequelize_1.Model {
}
exports.Spec = Spec;
class UserPushSubscription extends sequelize_1.Model {
}
exports.UserPushSubscription = UserPushSubscription;
class UserWishes extends sequelize_1.Model {
}
exports.UserWishes = UserWishes;
class Langs extends sequelize_1.Model {
}
exports.Langs = Langs;
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
        return sequelize_2.sequelize.transaction((t) => {
            if (fields.id) {
                return Product.findByPk(fields.id, {
                    include: [Spec],
                }).then((product) => {
                    let array = [];
                    product.Specs.forEach((spec) => {
                        array.push(spec.update(fields.specs[spec.name]));
                    });
                    array.push(product.update(fields));
                    return Promise.all(array);
                });
            }
            else {
                return Product.create(fields, {
                    include: [Spec, Link],
                });
            }
        });
    }
}
exports.Product = Product;
class ProductHistory extends sequelize_1.Model {
}
exports.ProductHistory = ProductHistory;
UserPushSubscription.init({
    user_id: { type: sequelize_1.DataTypes.INTEGER },
    endpoint: sequelize_1.DataTypes.TEXT,
    expirationTime: sequelize_1.DataTypes.DATE,
    keys: sequelize_1.DataTypes.TEXT,
}, { sequelize: sequelize_2.sequelize });
UserWishes.init({
    id: { type: sequelize_1.DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    product_id: { type: sequelize_1.DataTypes.INTEGER },
    user_id: { type: sequelize_1.DataTypes.INTEGER },
    price: sequelize_1.DataTypes.DECIMAL(13, 2),
    isAvailable: sequelize_1.DataTypes.BOOLEAN,
    date: sequelize_1.DataTypes.DATE,
}, { sequelize: sequelize_2.sequelize });
Spec.init({
    id: { type: sequelize_1.DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    prod_id: { type: sequelize_1.DataTypes.INTEGER },
    name: sequelize_1.DataTypes.STRING,
    value: sequelize_1.DataTypes.STRING,
    val_type: sequelize_1.DataTypes.STRING,
    category: { type: sequelize_1.DataTypes.STRING, defaultValue: "basic" },
    isComparable: { type: sequelize_1.DataTypes.BOOLEAN, defaultValue: false, field: "isComparable" },
    isFilterable: { type: sequelize_1.DataTypes.BOOLEAN, defaultValue: false, field: "isFilterable" },
}, { sequelize: sequelize_2.sequelize });
Category.init({
    name: sequelize_1.DataTypes.STRING,
}, { sequelize: sequelize_2.sequelize });
Order.init({
    id: { type: sequelize_1.DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: sequelize_1.DataTypes.STRING,
    price: sequelize_1.DataTypes.DOUBLE,
    currency_type: sequelize_1.DataTypes.STRING,
    deliver_adr: sequelize_1.DataTypes.STRING,
    payment_type: sequelize_1.DataTypes.STRING,
    payment_state: sequelize_1.DataTypes.STRING,
    order_state: sequelize_1.DataTypes.STRING,
    created_at: sequelize_1.DataTypes.DATE,
    updated_at: sequelize_1.DataTypes.DATE,
}, { sequelize: sequelize_2.sequelize });
User.init({
    id: { type: sequelize_1.DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: sequelize_1.DataTypes.STRING,
    name: sequelize_1.DataTypes.STRING,
    currency: sequelize_1.DataTypes.STRING,
    language: sequelize_1.DataTypes.STRING,
    created_at: sequelize_1.DataTypes.DATE,
    updated_at: sequelize_1.DataTypes.DATE,
}, { sequelize: sequelize_2.sequelize });
Discount.init({
    id: { type: sequelize_1.DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    // promo: DataTypes.STRING,
    // user_id ?
    // available_count: DataTypes.INTEGER,
    price: sequelize_1.DataTypes.DECIMAL(13, 2),
    begin_at: sequelize_1.DataTypes.DATE,
    end_at: sequelize_1.DataTypes.DATE,
}, { sequelize: sequelize_2.sequelize });
Product.init({
    category_id: { type: sequelize_1.DataTypes.INTEGER },
    discount_id: { type: sequelize_1.DataTypes.INTEGER },
    name: sequelize_1.DataTypes.STRING,
    description: sequelize_1.DataTypes.STRING,
    img_src: sequelize_1.DataTypes.STRING,
    price: sequelize_1.DataTypes.DECIMAL(13, 2),
    rating: sequelize_1.DataTypes.DOUBLE,
    vote_count: sequelize_1.DataTypes.INTEGER,
    views_count: sequelize_1.DataTypes.INTEGER,
    sales_count: sequelize_1.DataTypes.INTEGER,
    // is_published: DataTypes.BOOLEAN,
    // allow_publish: DataTypes.BOOLEAN,
    //or visible?
    is_visible: sequelize_1.DataTypes.BOOLEAN,
    is_bestseller: sequelize_1.DataTypes.BOOLEAN,
    available: sequelize_1.DataTypes.INTEGER,
    arrive_date: sequelize_1.DataTypes.DATE,
    created_at: sequelize_1.DataTypes.DATE,
    updated_at: sequelize_1.DataTypes.DATE,
}, { sequelize: sequelize_2.sequelize });
ProductHistory.init({
    product_id: { type: sequelize_1.DataTypes.INTEGER },
    price: sequelize_1.DataTypes.DECIMAL(13, 2),
    views_count: sequelize_1.DataTypes.INTEGER,
    sales_count: sequelize_1.DataTypes.INTEGER,
    date: sequelize_1.DataTypes.DATEONLY,
}, { sequelize: sequelize_2.sequelize });
Langs.init({
    locale: sequelize_1.DataTypes.STRING,
    key: sequelize_1.DataTypes.STRING,
    text: sequelize_1.DataTypes.TEXT,
}, { sequelize: sequelize_2.sequelize });
class Link extends sequelize_1.Model {
}
exports.Link = Link;
Link.init({
    product_id: { type: sequelize_1.DataTypes.INTEGER },
    content_id: sequelize_1.DataTypes.STRING,
    url: sequelize_1.DataTypes.STRING,
}, { sequelize: sequelize_2.sequelize });
UserWishes.belongsTo(Product);
UserWishes.belongsTo(User);
Product.hasOne(Discount);
Product.hasMany(Spec, { foreignKey: "prod_id", constraints: false });
Product.hasMany(ProductHistory);
Product.hasMany(Link);
// Product.Specs = Product.hasMany(Spec, { foreignKey: "prod_id", constraints: false });
User.hasMany(UserPushSubscription);
//# sourceMappingURL=models.js.map