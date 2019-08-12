import { NextFunction, Response, Request } from "express";
import { Order } from "../core/models";

const controller = {
    findAll: function (req: Request, res: Response, next: NextFunction) {
        Order.findAll({
            offset: res.locals.offset,
            limit: res.locals.limit
        }).then(orders => {
            Order.count().then(total => {
                !process.env.isUserNamesVisible && orders.forEach(order => order.name = "**** ****")
                res.render("orders", {
                    orders: orders,
                    total: total,
                    title: "Orders"
                })
            });
        });
    },
    findById: function (req: Request, res: Response, next: NextFunction) {
        Order.findOne({ where: { id: 1 } }).then(orders => {
            res.render("users", { order: orders });
            // res.send(project);
        });
    }
};

export { controller as orderController }
export default controller