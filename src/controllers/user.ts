import { NextFunction, Response, Request } from "express";
import { User } from "../core/models";

const controller = {
    findAll: function (req: Request, res: Response, next: NextFunction) {
        User.findAll({
            offset: res.locals.offset,
            limit: res.locals.limit
        }).then(users => {
            !process.env.isUserNamesVisible && users.forEach(user => user.name = "**** ****")
            User.count().then(total =>
                res.render("users", {
                    users: users,
                    total: total,
                    title: "Users"
                })
            );
        });
    }
};

export { controller as userController }
export default controller