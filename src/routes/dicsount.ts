import { Router } from "express";
import { Discount } from "../models";

const router = Router();

router.get("/discounts", function (req, res) {
  Discount.findAll().then((discounts) => {
    if (req.headers["content-type"] == "application/json") {
      res.send(discounts);
    } else {
      res.render("discounts", { discounts: discounts, title: "Discounts", authentication: true });
    }
  });
});

router.get("/discount/:id", function (req, res) {
  Discount.findByPk(req.params.id).then((discount) => {
    res.render("discount", { discount: discount, title: "Discount" });
  });
});

router.post("/discount/:id/edit", function (req, res) {
  Discount.update(req.body, { where: { id: req.params.id } });
  res.redirect("/discounts");
});

router.post("/discountCreate", function (req, res) {
  Discount.create(req.body);
  res.redirect("/discounts");
});

export { router as discountRouter };
export default router;
