import { User } from "../core/models";
import { RequestHandler } from "express-serve-static-core";

const findAll: RequestHandler = function (req, res) {
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

export default { findAll }