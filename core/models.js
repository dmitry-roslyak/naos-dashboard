const Sequelize = require("sequelize");
const sequelize = require("../core/config-init").sequelize;

const Category = sequelize.define("category", {
    name: Sequelize.STRING
});
const Order = sequelize.define("order", {
    id: { type: Sequelize.INTEGER, primaryKey: true },
    name: Sequelize.STRING,
    price: Sequelize.DOUBLE,
    currency_type: Sequelize.STRING,
    deliver_adr: Sequelize.STRING,
    payment_type: Sequelize.STRING,
    payment_state: Sequelize.STRING,
    order_state: Sequelize.STRING,
    created_at: Sequelize.DATE,
    updated_at: Sequelize.DATE
});
const User = sequelize.define("user", {
    id: { type: Sequelize.INTEGER, primaryKey: true },
    name: Sequelize.STRING,
    created_at: Sequelize.DATE,
    updated_at: Sequelize.DATE
    //   birthday: Sequelize.DATE
});
const Discount = sequelize.define("discount", {
    promo_code: Sequelize.STRING,
    discount: Sequelize.INTEGER,
    begin_at: Sequelize.DATE,
    end_at: Sequelize.DATE
});
const Product = sequelize.define("product", {
    // id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    category_id: { type: Sequelize.INTEGER, unsigned: true },
    discount_id: { type: Sequelize.INTEGER, unsigned: true },
    name: Sequelize.STRING,
    description: Sequelize.STRING,
    img_src: Sequelize.STRING,
    price: Sequelize.DOUBLE,
    rating: Sequelize.DOUBLE,
    vote_count: Sequelize.INTEGER,
    is_visible: Sequelize.BOOLEAN,
    is_bestseller: Sequelize.BOOLEAN,
    available: Sequelize.INTEGER,
    arrive_date: Sequelize.DATE,
    created_at: Sequelize.DATE,
    updated_at: Sequelize.DATE
    //   birthday: Sequelize.DATE
});
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
module.exports = { Product, Discount, User, Order, Category };