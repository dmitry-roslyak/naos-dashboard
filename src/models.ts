import { Sequelize, Model, DataTypes, BuildOptions } from "sequelize";
import { sequelize } from "./loaders/sequelize";

class Spec extends Model {
  name: string;
}

class UserPushSubscription extends Model {
  id: number;
  endpoint: string;
  expirationTime: string;
  keys: string;
}

class UserWishes extends Model {
  id: number;
  user_id: number;
  product_id: number;
  price: number;
  isAvailable: boolean;
  public readonly Product?: Product;
  public readonly User?: User;
}

class Langs extends Model {
  locale: string;
  key: string;
  text: string;
}

class Category extends Model {}
class Order extends Model {
  name: string;
}
class User extends Model {
  id: number;
  email: string;
  name: string;
  language: string;
  currency: string;
  public readonly UserPushSubscriptions?: UserPushSubscription[];
}
class Discount extends Model {
  id: number;
  price: number;
  begin_at: Date;
  end_at: Date;
}
class Product extends Model {
  id: number;
  views_count: number;
  sales_count: number;
  price: number;
  img_src: string;
  public readonly Discounts?: Discount[];
  public readonly Specs?: Spec[];
  static createOrUpdateWithSpecs(fields: any) {
    return sequelize.transaction((t) => {
      let array: Array<Promise<any>> = [];

      if (fields.id) {
        Product.findByPk(fields.id, {
          include: [Spec],
        }).then((product) => {
          product.Specs.forEach((spec) => {
            array.push(spec.update(fields.specs[spec.name]));
          });
          array.push(product.update(fields));
        });
      } else {
        array.push(
          Product.create(fields, {
            include: [Spec],
          })
        );
      }
      return Promise.all(array);
    });
  }
}

export class ProductHistory extends Model {}

UserPushSubscription.init(
  {
    user_id: { type: DataTypes.INTEGER },
    endpoint: DataTypes.TEXT,
    expirationTime: DataTypes.DATE,
    keys: DataTypes.TEXT,
  },
  { sequelize }
);

UserWishes.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    product_id: { type: DataTypes.INTEGER },
    user_id: { type: DataTypes.INTEGER },
    price: DataTypes.DECIMAL(13, 2),
    isAvailable: DataTypes.BOOLEAN,
    date: DataTypes.DATE,
  },
  { sequelize }
);

Spec.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    prod_id: { type: DataTypes.INTEGER },
    name: DataTypes.STRING,
    value: DataTypes.STRING,
    val_type: DataTypes.STRING,
    category: { type: DataTypes.STRING, defaultValue: "basic" },
    isComparable: { type: DataTypes.BOOLEAN, defaultValue: false, field: "isComparable" },
    isFilterable: { type: DataTypes.BOOLEAN, defaultValue: false, field: "isFilterable" },
  },
  { sequelize }
);

Category.init(
  {
    name: DataTypes.STRING,
  },
  { sequelize }
);

Order.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: DataTypes.STRING,
    price: DataTypes.DOUBLE,
    currency_type: DataTypes.STRING,
    deliver_adr: DataTypes.STRING,
    payment_type: DataTypes.STRING,
    payment_state: DataTypes.STRING,
    order_state: DataTypes.STRING,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
  },
  { sequelize }
);

User.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: DataTypes.STRING,
    name: DataTypes.STRING,
    currency: DataTypes.STRING,
    language: DataTypes.STRING,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
  },
  { sequelize }
);

Discount.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    price: DataTypes.DECIMAL(13, 2),
    begin_at: DataTypes.DATE,
    end_at: DataTypes.DATE,
  },
  { sequelize }
);

Product.init(
  {
    category_id: { type: DataTypes.INTEGER },
    discount_id: { type: DataTypes.INTEGER },
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    img_src: DataTypes.STRING,
    price: DataTypes.DECIMAL(13, 2),
    rating: DataTypes.DOUBLE,
    vote_count: DataTypes.INTEGER,
    views_count: DataTypes.INTEGER,
    sales_count: DataTypes.INTEGER,
    is_visible: DataTypes.BOOLEAN,
    is_bestseller: DataTypes.BOOLEAN,
    available: DataTypes.INTEGER,
    arrive_date: DataTypes.DATE,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
  },
  { sequelize }
);

ProductHistory.init(
  {
    product_id: { type: DataTypes.INTEGER },
    price: DataTypes.DECIMAL(13, 2),
    views_count: DataTypes.INTEGER,
    sales_count: DataTypes.INTEGER,
    date: DataTypes.DATEONLY,
  },
  { sequelize }
);

Langs.init(
  {
    locale: DataTypes.STRING,
    key: DataTypes.STRING,
    text: DataTypes.TEXT,
  },
  { sequelize }
);

UserWishes.belongsTo(Product);
UserWishes.belongsTo(User);
Product.hasOne(Discount);
Product.hasMany(Spec, { foreignKey: "prod_id", constraints: false });
Product.hasMany(ProductHistory);
// Product.Specs = Product.hasMany(Spec, { foreignKey: "prod_id", constraints: false });
User.hasMany(UserPushSubscription);

export { Product, Discount, User, Order, Category, Spec, UserPushSubscription, UserWishes, Langs };
