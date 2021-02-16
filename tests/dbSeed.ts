import { Category, Langs, Product, ProductHistory, Spec } from "../src/models";
import { sequelize } from "../src/loaders/sequelize";

var faker = require("faker");
const imagesPool = require("../imagesPool.json");

const imageProducer = getImage();

function getImage() {
  let i = 0;
  return function () {
    if (imagesPool.length == i) i = 0;
    return imagesPool[i++];
  };
}

export class SequelizeSeeder {
  static async run() {
    try {
      await sequelize.authenticate();
    } catch (error) {
      console.error("DB connection is refused!");
      return;
    }

    await sequelize.sync({ force: true });

    //is Needed?
    await sequelize.transaction(async (t) => {
      const products = [];
      for (let i = 0; i < 50; i++) {
        products.push({
          name: i < 3 ? "Pixel 5" : faker.commerce.product(),
          // name: faker.commerce.productName(),
          description: faker.commerce.productDescription(),
          price: faker.commerce.price(),
          img_src: i < 3 ? imagesPool[0] : imageProducer(),
          // img_src: faker.image.imageUrl(),
          views_count: faker.random.number(),
          sales_count: faker.random.number(),
          available: faker.random.number(),
          arrive_date: Math.floor(Math.random() * Math.floor(10)) < 9 ? faker.date.recent() : faker.date.future(),
        });
      }

      const prods = await Product.bulkCreate(products);
      const productHistories = [];
      for (let i = 0; i < prods.length; i++) {
        const iterationsCount = Math.floor(Math.random() * Math.floor(30)) || 1;
        for (let j = 0; j < iterationsCount; j++) {
          productHistories.push({
            product_id: prods[i].id,
            price: Math.floor(Math.random() * Math.floor(10)) < 3 ? faker.commerce.price() : prods[i].price,
            views_count: products[i].views_count - faker.random.number() || 0,
            sales_count: products[i].sales_count - faker.random.number() || 0,
            date: Math.floor(Math.random() * Math.floor(10)) < 3 ? faker.date.recent() : faker.date.past(),
          });
        }
      }

      await ProductHistory.bulkCreate(productHistories).catch((error) =>
        console.error("Error happend while ProductHistory.bulkCreate", error)
      );

      await Langs.bulkCreate([
        {
          locale: "uk",
          key: "webPushNotificationDiscountTitle",
          text: "Знижка ${priceDiff} ${currency} на товар!",
        },
        {
          locale: "ru",
          key: "webPushNotificationDiscountTitle",
          text: "Скидка ${priceDiff} ${currency} на товар!",
        },
        {
          locale: "en",
          key: "webPushNotificationDiscountTitle",
          text: "Product at a discount ${priceDiff} ${currency}!",
        },
      ]);

      await Category.create({
        name: "Test",
      });
      await Spec.create({
        name: "Test",
      });
    });
  }
}
