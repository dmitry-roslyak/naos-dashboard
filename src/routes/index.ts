import { Router } from "express";
import user from "../controllers/user";
import order from "../controllers/order";
import discount from "../controllers/discount";
import category from "../controllers/category";
import { RequestHandler } from "express-serve-static-core";
import { fileUpload } from "../utils";
import { ProductService } from "../services/ProductService";
import multer = require("multer");

const router = Router();
const upload = multer({ dest: "uploads/" });

router.use(function (req, res, next) {
  // console.log(req.signedCookies.api_token)
  res.locals.url = req.url;
  res.locals.appName = "Naos dashboard";
  res.locals.errors = [];
  res.locals.server = { url: process.env.NAOS_URL, status: 500 };
  // res.locals.authentication = req.signedCookies.api_token && req.signedCookies.api_token !== "false";
  process.env.NODE_ENV !== "production" && (res.locals.authentication = true);
  next();
});

router.post("/token", function (req, res, next) {
  // api_tokenVerify(req.body.token, req, res).then(function () {
  //   res.redirect("/");
  // });
});
router.get("/", function (req, res, next) {
  // statusCheck().then((status) => {
  //   res.locals.server.status = status;
  // });
  res.render("index.pug", { title: res.locals.appName });
});
router.all("*offset=:offset&limit=:limit", function (req, res, next) {
  res.locals.offset = +req.params.offset || +req.body.offset || null;
  res.locals.limit = +req.params.limit || +req.body.limit || 30;
  next();
});

router.get("/categories", category.show);
router.get("/category/:id", category.showOne);

router.get("/discounts", discount.show);
router.get("/discount/:id", discount.showOne);

router.get("/orders(/*)?", order.findAll);
router.get(
  "/users(/*)?",
  // "/users/?(offset=:offset&limit=:limit)?",
  // productController.paginator,
  user.findAll
);

router.get("/products", function (req, res) {
  const input = req.query.input || "";
  const offset = req.query.offset > 0 ? req.query.offset : null;
  const limit = req.query.limit > 0 ? req.query.limit : 30;
  ProductService.search(input, offset, limit).then(([products, count]) => {
    if (req.headers["content-type"] == "application/json") {
      res.send(products);
    } else {
      res.locals.formInput = input;
      res.locals.products = products;
      res.locals.total = count;
      res.render("products", { title: "Products" });
    }
  });
});
router.get("/product/:id", function (req, res) {
  if (req.params.id < 1) {
    res.status(400).send("id is required");
    return;
  }
  ProductService.showOne(req.params.id).then((showOneProduct: any) => {
    if (req.headers["content-type"] == "application/json") {
      res.send(showOneProduct);
    } else {
      res.render("product", showOneProduct);
    }
  });
});

router.get("/productCreate", async function (req, res) {
  //error when id=1 not found
  const product = ProductService.createV1old();
  ProductService.showOne(1).then((showOneProduct: any) => {
    showOneProduct.product = product;
    if (req.headers["content-type"] == "application/json") {
      res.send(showOneProduct);
    } else {
      res.render("product", showOneProduct);
    }
  });
});

const updateOrCreate: RequestHandler = async function (req, res) {
  const fields = req.body;
  const fileName =
    req.file &&
    fileUpload(process.env.NAOS_URL + "/api/image_upload", req.file.path).catch((err) => {
      console.log("\x1b[31m" + err);
    });

  ProductService.updateOrCreate(fields, fileName)
    .then((result) => {
      if (fields.id) {
        console.log("\x1b[32m" + `Product (id: ${fields.id}) updated`);
        res.redirect(".");
      } else {
        console.log("\x1b[32m" + `Product created`);
        res.redirect("/product/" + result[0].id);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(400).send(err.message);
    });
};

router.post("/productCreate", upload.single("image"), updateOrCreate);
router.post("/product/:id/edit", upload.single("image"), updateOrCreate);

router.get("/delete", function (req, res, next) {
  res.render("deleteWarning", {
    item: {
      category: req.query.itemCategory,
      id: req.query.id,
    },
    href: req.query.href,
  });
});

export { router as indexRouter };
export default router;
