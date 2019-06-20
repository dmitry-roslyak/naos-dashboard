import { Sequelize, Model, DataTypes, BuildOptions } from 'sequelize';
const sequelize = require("../core/config-init").sequelize;

class Spec extends Model { }
class Category extends Model { }
class Order extends Model { }
class User extends Model { }
class Discount extends Model { }
class Product extends Model { }

Spec.init({
    id: { type: DataTypes.INTEGER, primaryKey: true },
    prod_id: { type: DataTypes.INTEGER },
    name: DataTypes.STRING,
    value: DataTypes.STRING,
    val_type: DataTypes.STRING,
}, { sequelize });

Category.init({
    name: DataTypes.STRING
}, { sequelize });

Order.init({
    id: { type: DataTypes.INTEGER, primaryKey: true },
    name: DataTypes.STRING,
    price: DataTypes.DOUBLE,
    currency_type: DataTypes.STRING,
    deliver_adr: DataTypes.STRING,
    payment_type: DataTypes.STRING,
    payment_state: DataTypes.STRING,
    order_state: DataTypes.STRING,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE
}, { sequelize });

User.init({
    id: { type: DataTypes.INTEGER, primaryKey: true },
    name: DataTypes.STRING,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE
    //   birthday: DataTypes.DATE
}, { sequelize });

Discount.init({
    promo_code: DataTypes.STRING,
    discount: DataTypes.INTEGER,
    begin_at: DataTypes.DATE,
    end_at: DataTypes.DATE
}, { sequelize, modelName: 'discount' });

Product.init({
    // id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    category_id: { type: DataTypes.INTEGER },
    discount_id: { type: DataTypes.INTEGER },
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    img_src: DataTypes.STRING,
    price: DataTypes.DOUBLE,
    rating: DataTypes.DOUBLE,
    vote_count: DataTypes.INTEGER,
    is_visible: DataTypes.BOOLEAN,
    is_bestseller: DataTypes.BOOLEAN,
    available: DataTypes.INTEGER,
    arrive_date: DataTypes.DATE,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE
    //   birthday: DataTypes.DATE
}, { sequelize });

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
// export default Discount
// const a = { Product, Discount, User, Order, Category, Spec };
export { Product, Discount, User, Order, Category, Spec }
export default { Product, Discount, User, Order, Category, Spec }
// module.exports = { Product, Discount, User, Order, Category, Spec }
