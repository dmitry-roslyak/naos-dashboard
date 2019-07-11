import { NextFunction, Response, Request } from "express";
import { Discount } from "../core/models"

const controller = {
    show: function (req: Request, res: Response, next: NextFunction) {
        Discount.findAll().then(discounts => {
            res.render("discounts", { discounts: discounts, title: "Discounts" });
        });
    },
    showOne: function (req: Request, res: Response, next: NextFunction) {
        Discount.findByPk(req.params.id).then(discount => {
            res.render("discount", { discount: discount, title: "Discount" });
        });
    },
    create: function (req: Request, res: Response, next: NextFunction) {
        Discount.create(req.body);
        res.redirect("/discounts");
    },
    edit: function (req: Request, res: Response, next: NextFunction) {
        Discount.update(req.body, { where: { id: req.params.id } });
        res.redirect("/discounts");
    }
};

export { controller as discountController }
export default controller
