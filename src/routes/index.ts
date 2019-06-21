import { NextFunction, Response, Request, Router } from "express";
import { userController } from "../controllers/user";
import { orderController } from "../controllers/order";
import { discountController } from "../controllers/discount";
import { productController } from "../controllers/product";
import { categoriesController } from "../controllers/general";
import { api_tokenVerify } from "../core/naos_api";
import * as multer from "multer";

const router = Router();
const upload = multer({ dest: 'uploads/' });
/* GET home page. */
router.use(function (req: any, res, next) {
    res.locals.breadcrumbs = [];
    res.locals.breadcrumbs.push({ link: "/", name: "Home" });
    var name = req.path.split("/")[1];
    name && res.locals.breadcrumbs.push({ link: req.path, name: name });

    if (req.session.auth) next();
    else api_tokenVerify(null, req, res).then(() => {
        next();
    }).catch((error: Error) => next(error))
});
router.post("/token", function (req, res, next) {
    api_tokenVerify(req.body.token, req, res).then(function () {
        res.redirect('/');
    }).catch((error: Error) => next(error))
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
router.post("/categoryCreate", categoriesController.createCategory);

router.get("/discounts", discountController.show);
router.get("/discount/:id", discountController.showOne);
router.post("/discount/:id/edit", discountController.edit);
router.post("/discountCreate", discountController.create);

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
router.post("/productCreate", upload.single('image'), productController.updateOrCreate);
router.post("/product/:id/edit", upload.single('image'), productController.updateOrCreate);

export { router as indexRouter }
export default router