"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const models_1 = require("../models");
const router = express_1.Router();
exports.discountRouter = router;
router.get("/discounts", function (req, res) {
    models_1.Discount.findAll().then((discounts) => {
        if (req.headers["content-type"] == "application/json") {
            res.send(discounts);
        }
        else {
            res.render("discounts", { discounts: discounts, title: "Discounts", authentication: true });
        }
    });
});
router.get("/discount/:id", function (req, res) {
    models_1.Discount.findByPk(req.params.id).then((discount) => {
        res.render("discount", { discount: discount, title: "Discount" });
    });
});
router.post("/discount/:id/edit", function (req, res) {
    models_1.Discount.update(req.body, { where: { id: req.params.id } });
    res.redirect("/discounts");
});
router.post("/discountCreate", function (req, res) {
    models_1.Discount.create(req.body);
    res.redirect("/discounts");
});
exports.default = router;
//# sourceMappingURL=dicsount.js.map