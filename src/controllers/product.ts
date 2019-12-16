import { Product } from "../core/models";
import { RequestHandler } from "express-serve-static-core";
import { find } from "./product/find";
import { updateOrCreate } from "./product/updateOrCreate";
import { showOne } from "./product/showOne";

const create: RequestHandler = function (req, res, next) {
    let product = Product.build({
        rating: 0,
        vote_count: 0,
        is_visible: true,
    });
    showOne(req, res, next, product);
}

export default { create, showOne, updateOrCreate, find }
