import { Router } from "express";
import { Category } from "../models";

const router = Router();

router.get("/categories", function (req, res) {
  Category.findAll().then((categories) => {
    res.render("categories", { categories: categories, title: "Categories", authentication: true });
  });
});
router.get("/category/:id", function (req, res) {
  Category.findByPk(req.params.id).then((category) => {
    res.render("category", { category, title: "Category" });
  });
});
router.post("/categoryCreate", function (req, res) {
  Category.create(req.body);
  res.redirect("/categories");
});

export { router as categoryRouter };
export default router;
