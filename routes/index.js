const express = require("express");
const app = require("../app");
const productController = require("../controllers/product");
const userController = require("../controllers/user");
const orerController = require("../controllers/order");

var router = express.Router();

/* GET home page. */
router.use(function (req, res, next) {
    res.locals.breadcrumbs = [];
    res.locals.breadcrumbs.push({ link: "/", name: "Home" });
    var name = req.path.split("/")[1];
    name && res.locals.breadcrumbs.push({ link: req.path, name: name });
    next();
});
router.get("/", function (req, res, next) {
    res.render("index", { title: "Naos dashboard" });
});
router.all("*offset=:offset&limit=:limit", function (req, res, next) {
    res.locals.offset = +req.params.offset || +req.body.offset || null;
    res.locals.limit = +req.params.limit || +req.body.limit || 30;
    next();
});

router.get(
    "/orders(/*)?",
    orerController.findAll
);
router.get(
    "/users(/*)?",
    // "/users/?(offset=:offset&limit=:limit)?",
    // productController.paginator,
    userController.findAll
);
router.get("/user/:id", userController.findById);

router.get("/product/:id", productController.findById);

router.all(
    "/products/?(input=:input)?(&|*)?",
    // "/products/?(input=:input)?&?(offset=:offset&limit=:limit)?",
    // productController.paginator,
    productController.find
);
router.post("/product/:id/edit", productController.edit);

module.exports = router;
