const Sequelize = require("sequelize");
const sequelize = require("../core/config-init").sequelize;

const User = sequelize.define("user", {
    id: { type: Sequelize.INTEGER, primaryKey: true },
    name: Sequelize.STRING,
    created_at: Sequelize.DATE,
    updated_at: Sequelize.DATE
    //   birthday: Sequelize.DATE
});
const Discount = sequelize.define("discount", {
    id: { type: Sequelize.INTEGER, primaryKey: true },
    promo_code: Sequelize.STRING,
    discount: Sequelize.INTEGER,
    begin_at: Sequelize.DATE,
    end_at: Sequelize.DATE
});
const Product = sequelize.define("product", {
    id: { type: Sequelize.INTEGER, primaryKey: true },
    category_id: { type: Sequelize.INTEGER, unsigned: true },
    discount_id: { type: Sequelize.INTEGER, unsigned: true },
    name: Sequelize.STRING,
    description: Sequelize.STRING,
    img_src: Sequelize.STRING,
    price: Sequelize.DOUBLE,
    rating: Sequelize.DOUBLE,
    vote_count: Sequelize.INTEGER,
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
module.exports = { Product, Discount, User };