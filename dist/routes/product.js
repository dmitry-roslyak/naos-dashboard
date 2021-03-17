"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ProductService_1 = require("../services/ProductService");
const ImageService_1 = require("../services/ImageService");
const multer = require("multer");
const router = express_1.Router();
exports.productRouter = router;
const upload = multer({ dest: "public/images/" });
router.get("/products", function (req, res) {
    const input = req.query.input || "";
    const offset = req.query.offset > 0 ? req.query.offset : null;
    const limit = req.query.limit > 0 ? req.query.limit : 30;
    ProductService_1.ProductService.search(input, offset, limit).then(([products, count]) => {
        if (req.headers["content-type"] == "application/json") {
            res.send(products);
        }
        else {
            res.locals.server = { url: process.env.NAOS_URL, status: 200 };
            res.locals.formInput = input;
            res.locals.products = products;
            res.locals.total = count;
            res.render("products", { title: "Products" });
        }
    });
});
router.get("/product/:id", function (req, res) {
    if (req.params.id < 1) {
        res.status(400).send("id is required");
        return;
    }
    ProductService_1.ProductService.showOne(req.params.id).then((showOneProduct) => {
        if (req.headers["content-type"] == "application/json") {
            res.send(showOneProduct);
        }
        else {
            res.render("product", showOneProduct);
        }
    });
});
router.post("/product/create", upload.array("gallery", 30), function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!req.files || req.files.length < 1 || req.files.length > 30)
            res.status(400).send("file field cannot be empty");
        try {
            const fields = Object.assign(Object.assign({}, req.body), { Links: yield ImageService_1.ImageService.store([].map.call(req.files, (file) => file.path)) });
            ProductService_1.ProductService.create(fields).then((result) => {
                console.log("\x1b[32m" + `Product created`);
                res.send(result);
            });
        }
        catch (error) {
            console.error(error);
            res.status(500).send(error.message);
        }
    });
});
router.post("/product/:id/edit", upload.array("gallery", 30), function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!req.body.id && req.files.length < 1)
            res.status(400).send("Following field must be present: id or files > 0");
        try {
            const links = yield ImageService_1.ImageService.store([].map.call(req.files, (file) => file.path), req.body.content_ids);
            const fields = Object.assign(Object.assign({}, (req.body.id && req.body)), (req.files.length && { Links: links }));
            ProductService_1.ProductService.update(fields).then((result) => {
                console.log("\x1b[32m" + `Product updated`);
                res.send(result);
            });
        }
        catch (error) {
            console.error(error);
            res.status(500).send(error.message);
        }
    });
});
router.delete("/product-link/:id", function (req, res) {
    if (req.params.id > 1) {
        ProductService_1.ProductService.deleteLink(req.params.id)
            .then(() => {
            res.send("Link is deleted");
        })
            .catch((err) => {
            console.error(err);
            res.status(500).send(err.message);
        });
    }
    else
        res.status(400).send("Param id must be > 1");
});
exports.default = router;
//# sourceMappingURL=product.js.map