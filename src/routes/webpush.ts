import { Router } from "express";
import { WebPushService } from "../services/WebPushService";

var path = require("path");

const router = Router();

router.get("/vue", (req, res) => {
  const vueDir = path.join(__dirname, "../../online-store-dashboard/dist/");
  // console.log(vueDir);
  res.sendFile(vueDir + "vue.html");
});

router.post("/webpush/subscribe", function (req, res, next) {
  let body = req.body;

  if (body.identificator.key != "email" || !body.identificator.value) {
    res.status(400).send("identificator is unknown");
    return;
  }
  const expirationTime = body.subscription.expirationTime
    ? new Date(body.subscription.expirationTime)
    : new Date(+new Date() + 31536000000);

  if (+expirationTime - +new Date() < 0) {
    res.status(400).send("Subscription expired");
  }

  WebPushService.subscribe(body.identificator, {
    endpoint: body.subscription.endpoint,
    keys: body.subscription.keys,
    expirationTime,
  })
    .then(() => res.send("subscribe OK"))
    .catch((error) => {
      console.error(error.message);
      if (error.message == "PushSubscription: User is not authorized") res.status(401).send(error.message);
      else res.status(500).send("subscription failed");
    });
});

router.post("/webpush/broadcast", async function (req, res) {
  let { product_id } = req.body;
  const discountForProduct = await WebPushService.discountForProduct(product_id, {
    url: "https://example.org",
    currency: "₴",
  });
  WebPushService.getInstance()
    .broadcast(discountForProduct.usersIDs, discountForProduct.webPushPayloadArray)
    .then(() => res.send("broadcast OK"));
});

router.get("/webpush/generate-vapid-keys", function (req, res, next) {
  WebPushService.generateVAPIDKeys();
  res.send(JSON.stringify(WebPushService));
});

export { router as webpushRouter };
export default router;
