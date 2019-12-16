"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const uuidv4 = require('uuid/v4');
const index_1 = require("./routes/index");
const admin_1 = require("./routes/admin");
// var usersRouter = require("./routes/users");
var app = express();
// view engine setup
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "pug");
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(uuidv4()));
app.use(express.static(path.join(__dirname, "../public")));
app.use("/", index_1.default, admin_1.default);
// app.use("/users", usersRouter);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});
// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render("error");
});
module.exports = app;
//# sourceMappingURL=app.js.map