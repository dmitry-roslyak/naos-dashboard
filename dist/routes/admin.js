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
const discount_1 = require("../controllers/discount");
// import { updateOrCreate } from "../controllers/product/updateOrCreate";
const category_1 = require("../controllers/category");
const multer = require("multer");
const utils_1 = require("../utils");
const router = express_1.Router();
exports.adminRouter = router;
const upload = multer({ dest: "uploads/" });
router.use(function (req, res, next) {
    next();
    return;
    console.log((res.locals.authentication && "authorized") || "401");
    res.locals.authentication ? next() : res.status(401).end();
});
router.post("/categoryCreate", category_1.default.createCategory);
router.post("/discount/:id/edit", discount_1.default.edit);
router.post("/discountCreate", discount_1.default.create);
// router.post("/productCreate", upload.single("image"), updateOrCreate);
// router.post("/product/:id/edit", upload.single("image"), updateOrCreate);
router.post("/secret_upload", upload.single("file"), function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        req.file &&
            (yield utils_1.fileUpload(process.env.NAOS_URL + "/api/visa_secret_upload", req.file.path)
                .then(() => {
                res.redirect(".");
            })
                .catch((err) => res.status(400).send(err.message)));
    });
});
exports.default = router;
//# sourceMappingURL=admin.js.map