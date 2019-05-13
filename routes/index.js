const express = require("express");
const discountController = require("../controllers/general");
const categoriesController = require("../controllers/general");
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

router.get("/categories", categoriesController.showCategories);
router.post("/createCategory", categoriesController.createCategory);

router.get(
    "/discounts",
    discountController.showDiscounts
);
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

router.all(
    "/products/?(input=:input)?(&|*)?",
    // "/products/?(input=:input)?&?(offset=:offset&limit=:limit)?",
    // productController.paginator,
    productController.find
);
router.get("/product/:id", productController.showOne);
router.get("/productCreate", productController.create);
router.post("/productCreate", productController.updateOrCreate);
router.post("/product/:id/edit", productController.updateOrCreate);

module.exports = router;
