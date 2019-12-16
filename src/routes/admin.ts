import { NextFunction, Response, Request, Router } from "express";
import discount from "../controllers/discount";
import product from "../controllers/product";
import category from "../controllers/category";
import * as multer from "multer";

const router = Router();
const upload = multer({ dest: 'uploads/' });

router.use(function (req, res, next) {
    console.log(res.locals.authentication && "authorized" || "401")
    res.locals.authentication ? next() : res.status(401).end()
});

router.post("/categoryCreate", category.createCategory);
router.post("/discount/:id/edit", discount.edit);
router.post("/discountCreate", discount.create);
router.post("/productCreate", upload.single('image'), product.updateOrCreate);
router.post("/product/:id/edit", upload.single('image'), product.updateOrCreate);

export { router as adminRouter }
export default router