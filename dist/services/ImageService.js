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
const fs_1 = require("fs");
const sharp = require("sharp");
const { v1: uuidv1 } = require("uuid");
var ImageExtension;
(function (ImageExtension) {
    ImageExtension["webp"] = "webp";
    ImageExtension["jpeg"] = "jpeg";
    ImageExtension["png"] = "png";
})(ImageExtension || (ImageExtension = {}));
class ImageService {
    static store(filesPaths, content_ids) {
        return __awaiter(this, void 0, void 0, function* () {
            const promises = [];
            for (let i = 0; i < filesPaths.length; i++) {
                promises.push(ImageService.storeOne(filesPaths[i], content_ids[i]));
            }
            const links = yield Promise.all(promises);
            const result = [];
            for (let i = 0; i < links.length; i++) {
                result.push(...links[i]);
            }
            return result;
        });
    }
    static storeOne(filePath, content_id = uuidv1()) {
        return __awaiter(this, void 0, void 0, function* () {
            const stream = fs_1.createReadStream(filePath);
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
            const promiseResult = [];
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
                promises.push(sharpStream
                    .clone()
                    .resize(array[i].resize)[array[i].extension]({ quality: array[i].quality })
                    .toFile("public" + filePath));
            }
            stream.pipe(sharpStream);
            return Promise.all(promises)
                .then(() => {
                fs_1.unlinkSync(filePath);
                return promiseResult;
            })
                .catch((err) => {
                console.error("Error processing files, let's clean it up", err);
                try {
                }
                catch (e) {
                    console.error(e);
                }
            });
        });
    }
}
exports.ImageService = ImageService;
//# sourceMappingURL=ImageService.js.map