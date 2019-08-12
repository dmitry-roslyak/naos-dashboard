"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const discount_1 = require("../controllers/discount");
const product_1 = require("../controllers/product");
const category_1 = require("../controllers/category");
const multer = require("multer");
const router = express_1.Router();
exports.adminRouter = router;
const upload = multer({ dest: 'uploads/' });
router.use(function (req, res, next) {
    console.log(res.locals.authentication && "authorized" || "401");
    res.locals.authentication ? next() : res.status(401).end();
});
router.post("/categoryCreate", category_1.categoriesController.createCategory);
router.post("/discount/:id/edit", discount_1.discountController.edit);
router.post("/discountCreate", discount_1.discountController.create);
router.post("/productCreate", upload.single('image'), product_1.productController.updateOrCreate);
router.post("/product/:id/edit", upload.single('image'), product_1.productController.updateOrCreate);
exports.default = router;
//# sourceMappingURL=admin.js.map