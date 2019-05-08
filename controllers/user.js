const User = require("../core/models").User;

module.exports = {
    findAll: function (req, res, next) {
        User.findAll({
            offset: res.locals.offset,
            limit: res.locals.limit
        }).then(users => {
            User.count().then(total =>
                res.render("users", {
                    users: users,
                    total: total,
                    title: "Test"
                })
            );
        });
    },
    findById: function (req, res, next) {
        User.findOne({ where: { id: 1 } }).then(users => {
            res.render("users", { user: users });
            // res.send(project);
        });
    }
};
