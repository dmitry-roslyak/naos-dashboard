import { Product } from "../../core/models";
import { imageUpload } from "../../core/naos_api";
import { RequestHandler } from "express-serve-static-core";

export const updateOrCreate: RequestHandler = async function (req, res) {
  let fields = req.body;
  let error: any;
  let imageName = req.file && await imageUpload(req).catch(err => error = err)
  if (error) {
    res.status(400).send(error.message)
    return
  }

  Object.keys(fields).forEach(name => name == "specs" || Array.isArray(fields[name]) && (fields[name] = fields[name][0]));
  if (imageName) fields.img_src = imageName
  fields.Specs = Object.values(fields.specs)
  fields.Specs = fields.Specs.filter((element: any) => element.value.length > 0);

  Product.createOrUpdateWithSpecs(fields).then((result) => {
    setTimeout(() => {
      if (fields.id) {
        console.log(`Product (id: ${fields.id}) updated`);
        res.redirect(".");
      } else {
        console.log(`Product created`);
        res.redirect("/product/" + result[0].id);
      }
    }, 50);
  }).catch(err => {
    console.error(err)
    res.status(400).send(err.message);
  });
}