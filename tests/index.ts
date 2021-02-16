import { Product, User, UserWishes } from "../src/models";
import { WebPushService } from "../src/services/WebPushService";
import {} from "../src/loaders/WebPushLoader";
import { SequelizeSeeder } from "./dbSeed";

var assert = require("assert");

before(async () => {
  await SequelizeSeeder.run();
});

describe("sequelize.sync()", () => {
  it("UserWish db create", async () => {
    const prArray: any = [
      User.create({
        email: "formulaone.forever@gmail.com",
        language: "uk",
        currency: "UAH",
      }),
      Product.findOne({
        where: {
          id: 1,
        },
      }),
    ];

    return Promise.all(prArray).then(([user, product]: any) => {
      return UserWishes.create({
        user_id: user.id,
        product_id: product.id,
        price: product.price,
        isAvailable: true,
      })
        .then((userWish) => {
          const keys1 = Object.keys(JSON.parse(JSON.stringify(userWish)));
          console.log(keys1);
          const keys2 = Object.keys(UserWishes.rawAttributes);
          console.log(keys2);
          const arr = [];
          for (let i = 0; i < keys1.length; i++) {
            arr.push(keys1.includes(keys2[i]));
          }
          assert.ok(!arr.includes(false));
        })
        .catch((err) => assert.fail([err]));
    });
  });
  it("Discount for product", async () => {
    const currency = "₴";
    const price = 0.99;
    await Product.update(
      {
        price,
        date: new Date(),
      },
      { where: { id: 1 } }
    );
    const discountForProduct = await WebPushService.discountForProduct(1, {
      url: "https://example.org",
      currency,
    });
    console.log(discountForProduct);

    discountForProduct || assert.fail("discountForProduct is null");

    const userWish = await UserWishes.findOne({ where: { id: 1 } });
    assert.ok(
      discountForProduct.webPushPayloadArray[0].title === `Знижка ${price - userWish.price} ${currency} на товар!`
    );
  });
});
