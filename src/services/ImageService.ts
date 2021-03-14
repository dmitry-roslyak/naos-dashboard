import { createReadStream, unlinkSync } from "fs";
const sharp = require("sharp");
const { v1: uuidv1 } = require("uuid");

enum ImageExtension {
  webp = "webp",
  jpeg = "jpeg",
  png = "png",
}

export class ImageService {
  static async store(filesPaths: string[], content_ids?: string[]) {
    const promises = [];

    for (let i = 0; i < filesPaths.length; i++) {
      promises.push(ImageService.storeOne(filesPaths[i], content_ids[i]));
    }

    const links = await Promise.all(promises);
    const result = [];

    for (let i = 0; i < links.length; i++) {
      result.push(...links[i]);
    }

    return result;
  }
  static async storeOne(filePath: string, content_id: string = uuidv1()) {
    const stream = createReadStream(filePath);
    // const content_id = uuidv1();

    const sharpStream = sharp({
      failOnError: false,
    });

    const promises = [];

    // const names = [
    //   `/images/${content_id}-f.jpeg`,
    //   `/images/${content_id}-360w.webp`,
    //   `/images/${content_id}-640w.webp`,
    //   `/images/${content_id}-1280w.webp`,
    //   `/images/${content_id}-orig.webp`,
    // ];

    const promiseResult: any = [];

    const array = [
      { srcset: "f", resize: { width: 1280 }, quality: 90, extension: ImageExtension.jpeg },
      { srcset: "360w", resize: { width: 360 }, quality: 70, extension: ImageExtension.webp },
      { srcset: "640w", resize: { width: 640 }, quality: 70, extension: ImageExtension.webp },
      { srcset: "1280w", resize: { width: 1280 }, quality: 70, extension: ImageExtension.webp },
      { srcset: "orig", resize: { width: null }, quality: 70, extension: ImageExtension.webp },
    ];

    for (let i = 0; i < array.length; i++) {
      const filePath = `/images/${content_id}-${array[i].srcset}.${array[i].extension}`;
      promiseResult.push({
        content_id,
        url: filePath,
      });
      promises.push(
        sharpStream
          .clone()
          .resize(array[i].resize)
          [array[i].extension]({ quality: array[i].quality })
          .toFile("public" + filePath)
      );
    }

    stream.pipe(sharpStream);

    return Promise.all(promises)
      .then(() => {
        unlinkSync(filePath);
        return promiseResult;
      })
      .catch((err) => {
        console.error("Error processing files, let's clean it up", err);
        try {
        } catch (e) {
          console.error(e);
        }
      });
  }
}
