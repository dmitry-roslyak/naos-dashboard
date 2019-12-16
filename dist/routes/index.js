"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_1 = require("../controllers/user");
const order_1 = require("../controllers/order");
const discount_1 = require("../controllers/discount");
const product_1 = require("../controllers/product");
const category_1 = require("../controllers/category");
const naos_api_1 = require("../core/naos_api");
const router = express_1.Router();
exports.indexRouter = router;
router.use(function (req, res, next) {
    // console.log(req.signedCookies.api_token)
    res.locals.url = req.url;
    res.locals.appName = "Naos dashboard";
    res.locals.errors = [];
    res.locals.server = { url: process.env.NAOS_URL, status: 500 };
    res.locals.authentication = req.signedCookies.api_token && req.signedCookies.api_token !== "false";
    // process.env.NODE_ENV !== 'production' && (res.locals.authentication = true);
    next();
});
router.post("/token", function (req, res, next) {
    naos_api_1.api_tokenVerify(req.body.token, req, res).then(function () {
        res.redirect('/');
    });
});
router.get("/", function (req, res, next) {
    naos_api_1.statusCheck().then(status => {
        res.locals.server.status = status;
        res.render("index", { title: res.locals.appName });
    });
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
router.all("/products/?(input=:input)?(&|*)?", 
// "/products/?(input=:input)?&?(offset=:offset&limit=:limit)?",
// productController.paginator,
product_1.default.find);
router.get("/product/:id", product_1.default.showOne);
router.get("/productCreate", product_1.default.create);
router.get("/delete", function (req, res, next) {
    res.render("deleteWarning", {
        item: {
            category: req.query.itemCategory,
            id: req.query.id
        },
        href: req.query.href,
    });
});
exports.default = router;
//# sourceMappingURL=index.js.map