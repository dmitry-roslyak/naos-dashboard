import { NextFunction, Response, Request, Router } from "express";
import { userController } from "../controllers/user";
import { orderController } from "../controllers/order";
import { discountController } from "../controllers/discount";
import { productController } from "../controllers/product";
import { categoriesController } from "../controllers/category";
import * as multer from "multer";

const router = Router();
const upload = multer({ dest: 'uploads/' });

router.use(function (req, res, next) {
    console.log(res.locals.authentication && "authorized" || "401")
    res.locals.authentication ? next() : res.status(401).end()
});

router.post("/categoryCreate", categoriesController.createCategory);
router.post("/discount/:id/edit", discountController.edit);
router.post("/discountCreate", discountController.create);
router.post("/productCreate", upload.single('image'), productController.updateOrCreate);
router.post("/product/:id/edit", upload.single('image'), productController.updateOrCreate);

export { router as adminRouter }
export default router