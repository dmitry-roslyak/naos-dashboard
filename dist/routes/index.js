"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_1 = require("../controllers/user");
const order_1 = require("../controllers/order");
const discount_1 = require("../controllers/discount");
const category_1 = require("../controllers/category");
const utils_1 = require("../utils");
const ProductService_1 = require("../services/ProductService");
const multer = require("multer");
const router = express_1.Router();
exports.indexRouter = router;
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
router.get("/categories", category_1.default.show);
router.get("/category/:id", category_1.default.showOne);
router.get("/discounts", discount_1.default.show);
router.get("/discount/:id", discount_1.default.showOne);
router.get("/orders(/*)?", order_1.default.findAll);
router.get("/users(/*)?", 
// "/users/?(offset=:offset&limit=:limit)?",
// productController.paginator,
user_1.default.findAll);
router.get("/products", function (req, res) {
    const input = req.query.input || "";
    const offset = req.query.offset > 0 ? req.query.offset : null;
    const limit = req.query.limit > 0 ? req.query.limit : 30;
    ProductService_1.ProductService.search(input, offset, limit).then(([products, count]) => {
        if (req.headers["content-type"] == "application/json") {
            res.send(products);
        }
        else {
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
    ProductService_1.ProductService.showOne(req.params.id).then((showOneProduct) => {
        if (req.headers["content-type"] == "application/json") {
            res.send(showOneProduct);
        }
        else {
            res.render("product", showOneProduct);
        }
    });
});
router.get("/productCreate", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        //error when id=1 not found
        const product = ProductService_1.ProductService.createV1old();
        ProductService_1.ProductService.showOne(1).then((showOneProduct) => {
            showOneProduct.product = product;
            if (req.headers["content-type"] == "application/json") {
                res.send(showOneProduct);
            }
            else {
                res.render("product", showOneProduct);
            }
        });
    });
});
const updateOrCreate = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const fields = req.body;
        const fileName = req.file &&
            utils_1.fileUpload(process.env.NAOS_URL + "/api/image_upload", req.file.path).catch((err) => {
                console.log("\x1b[31m" + err);
            });
        ProductService_1.ProductService.updateOrCreate(fields, fileName)
            .then((result) => {
            if (fields.id) {
                console.log("\x1b[32m" + `Product (id: ${fields.id}) updated`);
                res.redirect(".");
            }
            else {
                console.log("\x1b[32m" + `Product created`);
                res.redirect("/product/" + result[0].id);
            }
        })
            .catch((err) => {
            console.error(err);
            res.status(400).send(err.message);
        });
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
exports.default = router;
//# sourceMappingURL=index.js.map