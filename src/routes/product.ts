import { Router } from "express";
import { ProductService } from "../services/ProductService";
import { ImageService } from "../services/ImageService";
import multer = require("multer");

const router = Router();
const upload = multer({ dest: "public/images/" });

router.get("/products", function (req, res) {
  const input = req.query.input || "";
  const offset = req.query.offset > 0 ? req.query.offset : null;
  const limit = req.query.limit > 0 ? req.query.limit : 30;
  ProductService.search(input, offset, limit).then(([products, count]) => {
    if (req.headers["content-type"] == "application/json") {
      res.send(products);
    } else {
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
  ProductService.showOne(req.params.id).then((showOneProduct: any) => {
    if (req.headers["content-type"] == "application/json") {
      res.send(showOneProduct);
    } else {
      res.render("product", showOneProduct);
    }
  });
});

router.post("/product/create", upload.array("gallery", 30), async function (req, res) {
  if (!req.files || req.files.length < 1 || req.files.length > 30) res.status(400).send("file field cannot be empty");

  try {
    const fields = {
      ...req.body,
      Links: await ImageService.store([].map.call(req.files, (file: any) => file.path)),
    };

    ProductService.create(fields).then((result) => {
      console.log("\x1b[32m" + `Product created`);
      res.send(result);
    });
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});

router.post("/product/:id/edit", upload.array("gallery", 30), async function (req, res) {
  if (!req.body.id && req.files.length < 1) res.status(400).send("Following field must be present: id or files > 0");

  try {
    const links = await ImageService.store(
      [].map.call(req.files, (file: any) => file.path),
      req.body.content_ids
    );
    const fields = {
      ...(req.body.id && req.body),
      ...(req.files.length && { Links: links }),
    };

    ProductService.update(fields).then((result) => {
      console.log("\x1b[32m" + `Product updated`);
      res.send(result);
    });
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});

router.delete("/product-link/:id", function (req, res) {
  if (req.params.id > 1) {
    ProductService.deleteLink(req.params.id)
      .then(() => {
        res.send("Link is deleted");
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send(err.message);
      });
  } else res.status(400).send("Param id must be > 1");
});

export { router as productRouter };
export default router;
