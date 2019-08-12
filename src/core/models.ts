import { Sequelize, Model, DataTypes, BuildOptions } from 'sequelize';
import sequelize from './config-init';

class Spec extends Model {
    name: string;
}
class Category extends Model { }
class Order extends Model {
    name: string
}
class User extends Model {
    name: string
}
class Discount extends Model { }
class Product extends Model {
    Specs: Spec[];
    static createOrUpdateWithSpecs(fields: any) {
        return sequelize.transaction(t => {
            let array: Array<Promise<any>> = [];

            if (fields.id) {
                Product.findByPk(fields.id, {
                    include: [Spec]
                }).then(product => {
                    product.Specs.forEach(spec => {
                        array.push(spec.update(fields.specs[spec.name]))
                    })
                    array.push(product.update(fields))
                })
            } else {
                array.push(Product.create(fields, {
                    include: [Spec]
                }));
            }
            return Promise.all(array);
        })
    }
}

Spec.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    prod_id: { type: DataTypes.INTEGER },
    name: DataTypes.STRING,
    value: DataTypes.STRING,
    val_type: DataTypes.STRING,
    category: { type: DataTypes.STRING, defaultValue: "basic" },
    isComparable: { type: DataTypes.BOOLEAN, defaultValue: false, field: "isComparable" },
    isFilterable: { type: DataTypes.BOOLEAN, defaultValue: false, field: "isFilterable" }
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
    currency: DataTypes.STRING,
    language: DataTypes.STRING,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE
}, { sequelize });

Discount.init({
    promo_code: DataTypes.STRING,
    discount: DataTypes.INTEGER,
    begin_at: DataTypes.DATE,
    end_at: DataTypes.DATE
}, { sequelize });

Product.init({
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

Product.belongsTo(Discount);
Product.hasMany(Spec, { foreignKey: "prod_id", constraints: false });
// Product.Specs = Product.hasMany(Spec, { foreignKey: "prod_id", constraints: false });

export { Product, Discount, User, Order, Category, Spec }
export default { Product, Discount, User, Order, Category, Spec }
