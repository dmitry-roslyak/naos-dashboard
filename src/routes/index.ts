import { Router } from "express";
import { userController } from "../controllers/user";
import { orderController } from "../controllers/order";
import { discountController } from "../controllers/discount";
import { productController } from "../controllers/product";
import { categoriesController } from "../controllers/category";
import { api_tokenVerify, statusCheck } from "../core/naos_api";

const router = Router();

router.use(function (req, res, next) {
    // console.log(req.signedCookies.api_token)
    res.locals.appName = "Naos dashboard";
    res.locals.errors = [];
    res.locals.server = { url: process.env.NAOS_URL, status: 500 }
    res.locals.authentication = !!req.signedCookies.api_token;
    process.env.NODE_ENV !== 'production' && (res.locals.authentication = true);
    next();
});
router.post("/token", function (req, res, next) {
    api_tokenVerify(req.body.token, req, res).then(function () {
        res.redirect('/');
    }).catch((error: Error) => next(error))
});
router.get("/", function (req, res, next) {
    statusCheck().then(status => {
        res.locals.server.status = status;
        res.render("index", { title: res.locals.appName });
    }).catch(err => {
        res.locals.errors.push(err.message);
        res.render("index", { title: res.locals.appName });
    })
});
router.all("*offset=:offset&limit=:limit", function (req, res, next) {
    res.locals.offset = +req.params.offset || +req.body.offset || null;
    res.locals.limit = +req.params.limit || +req.body.limit || 30;
    next();
});

router.get("/categories", categoriesController.showCategories);

router.get("/discounts", discountController.show);
router.get("/discount/:id", discountController.showOne);

router.get(
    "/orders(/*)?",
    orderController.findAll
);
router.get(
    "/users(/*)?",
    // "/users/?(offset=:offset&limit=:limit)?",
    // productController.paginator,
    userController.findAll
);

router.all(
    "/products/?(input=:input)?(&|*)?",
    // "/products/?(input=:input)?&?(offset=:offset&limit=:limit)?",
    // productController.paginator,
    productController.find
);
router.get("/product/:id", productController.showOne);
router.get("/productCreate", productController.create);

export { router as indexRouter }
export default router