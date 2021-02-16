import { Router } from "express";
import discount from "../controllers/discount";
// import { updateOrCreate } from "../controllers/product/updateOrCreate";
import category from "../controllers/category";
import * as multer from "multer";
import { fileUpload } from "../utils";

const router = Router();
const upload = multer({ dest: "uploads/" });

router.use(function (req, res, next) {
  next();
  return;
  console.log((res.locals.authentication && "authorized") || "401");
  res.locals.authentication ? next() : res.status(401).end();
});

router.post("/categoryCreate", category.createCategory);
router.post("/discount/:id/edit", discount.edit);
router.post("/discountCreate", discount.create);
// router.post("/productCreate", upload.single("image"), updateOrCreate);
// router.post("/product/:id/edit", upload.single("image"), updateOrCreate);
router.post("/secret_upload", upload.single("file"), async function (req, res) {
  req.file &&
    (await fileUpload(process.env.NAOS_URL + "/api/visa_secret_upload", req.file.path)
      .then(() => {
        res.redirect(".");
      })
      .catch((err) => res.status(400).send(err.message)));
});

export { router as adminRouter };
export default router;
