import { NextFunction, Response, Request } from "express";
import { User } from "../core/models";

module.exports = {
    findAll: function (req: Request, res: Response, next: NextFunction) {
        User.findAll({
            offset: res.locals.offset,
            limit: res.locals.limit
        }).then(users => {
            User.count().then(total =>
                res.render("users", {
                    users: users,
                    total: total,
                    title: "Users"
                })
            );
        });
    },
    findById: function (req: Request, res: Response, next: NextFunction) {
        User.findOne({ where: { id: 1 } }).then(users => {
            res.render("users", { user: users });
            // res.send(project);
        });
    }
};
