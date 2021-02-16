import { sendNotification, generateVAPIDKeys, PushSubscription } from "web-push";
import { UserPushSubscription, User, UserWishes, Product } from "../models";
import { LocalizationService, LocalizationTemplateKey } from "../services/l10n";

interface WebPushSubscription extends PushSubscription {
  expirationTime: Date;
}

export class WebPushService {
  private subject: string;
  private privateKey: string;
  private publicKey: string;
  private static _webPushService: WebPushService;

  private constructor(subject: string, privateKey: string, publicKey: string) {
    this.subject = subject;
    this.privateKey = privateKey;
    this.publicKey = publicKey;
  }

  public static getInstance(subject?: string, privateKey?: string, publicKey?: string) {
    if (this._webPushService) return this._webPushService;
    else return (this._webPushService = new WebPushService(subject, privateKey, publicKey));
  }

  public async sendNotification(pushSubscription: PushSubscription, payload?: string | Buffer) {
    const pushOptions = {
      vapidDetails: {
        subject: this.subject,
        privateKey: this.privateKey,
        publicKey: this.publicKey,
      },
      // TTL: payload.ttl,
      headers: {},
    };
    return sendNotification(pushSubscription, payload, pushOptions);
  }

  static async subscribe(identificator: { key: string; value: string }, subscription: WebPushSubscription) {
    return User.findOne({
      where: {
        [identificator.key]: identificator.value,
      },
      include: [UserPushSubscription],
      order: [[UserPushSubscription, "expirationTime", "DESC"]],
    }).then(async (user) => {
      async function userPushSubscriptionCreate() {
        return UserPushSubscription.create({
          user_id: user.id,
          endpoint: subscription.endpoint,
          expirationTime: subscription.expirationTime,
          keys: JSON.stringify(subscription.keys),
        });
      }

      if (!user) {
        throw new Error("PushSubscription: User is not authorized");
      } else if (!user.UserPushSubscriptions) {
        return userPushSubscriptionCreate();
      } else if (user.UserPushSubscriptions.length > 9) {
        return user.UserPushSubscriptions[user.UserPushSubscriptions.length - 1].update({
          endpoint: subscription.endpoint,
          expirationTime: subscription.expirationTime,
          keys: JSON.stringify(subscription.keys),
        });
      } else {
        let pushSubscription = user.UserPushSubscriptions.find(
          (userPushSubscription) => userPushSubscription.endpoint === subscription.endpoint
        );
        if (pushSubscription) {
          return pushSubscription.update({
            endpoint: subscription.endpoint,
            expirationTime: subscription.expirationTime,
            keys: JSON.stringify(subscription.keys),
          });
        } else {
          return userPushSubscriptionCreate();
        }
      }
    });
  }

  public static async discountForProduct(product_id: number | string, params: any) {
    return UserWishes.findAll({
      where: {
        product_id,
      },
      attributes: ["user_id", "price"],
      include: [User, Product],
      // raw: true,
    }).then(async (userWishes) => {
      const usersIDs: number[] = [];
      const webPushPayloadArray: any[] = [];
      for (let i = 0; i < userWishes.length; i++) {
        // console.log(userWishes[i]);
        const priceDiff = userWishes[i].Product.price - userWishes[i].price;
        if (priceDiff >= 0) {
          console.log("Price must be greater than 0 and negative, 0 > ", priceDiff);
          return;
        }
        const title = await LocalizationService.localize(
          userWishes[i].User.language,
          LocalizationTemplateKey.webPushNotificationDiscountTitle,
          [
            {
              key: "priceDiff",
              value: priceDiff.toString(),
            },
            {
              key: "priceTotal",
              value: userWishes[i].price.toString(),
            },
            {
              key: "currency",
              value: params.currency,
              // value: userWishes[i].User.currency,
            },
          ]
        );
        usersIDs.push(userWishes[i].user_id);
        webPushPayloadArray.push({
          title,
          body: "",
          icon: userWishes[i].Product.img_src,
          data: { url: params.url },
        });
      }

      return {
        usersIDs,
        webPushPayloadArray,
      };
    });
  }

  public async broadcast(usersIDs: number[], payload: any) {
    return UserPushSubscription.findAll({ where: { user_id: usersIDs } }).then((userPushSubscriptions) => {
      // console.log("subscriptions: ", userPushSubscriptions);
      for (let i = 0; i < userPushSubscriptions.length; i++) {
        this.sendNotification(
          {
            endpoint: userPushSubscriptions[i].endpoint,

            keys: payload instanceof Array ? JSON.parse(userPushSubscriptions[i].keys) : payload,
          },
          JSON.stringify(payload[i])
        ).catch((error) => console.error(error));
      }
    });
  }

  // VAPID keys should only be generated only once.
  public static generateVAPIDKeys() {
    return generateVAPIDKeys();
  }
}
