import { Langs } from "../models";

enum LocalizationKey {}
export enum LocalizationTemplateKey {
  webPushNotificationDiscountTitle = "webPushNotificationDiscountTitle",
}

interface LocalizationReplace {
  key: string;
  value: string;
}

export class LocalizationService {
  public static async localize(
    locale: string,
    key: LocalizationKey | LocalizationTemplateKey,
    replace?: LocalizationReplace[]
  ) {
    return Langs.findOne({
      where: {
        locale,
        key,
      },
      raw: true,
    }).then((row) => {
      if (replace && Object.keys(LocalizationTemplateKey).includes(key as string)) {
        return LocalizationService.interpolate(row.text, replace);
      } else {
        return row.text;
      }
    });
  }

  private static interpolate(templateString: string, replace: LocalizationReplace[]) {
    replace.forEach((r) => {
      templateString = templateString.replace("${" + r.key + "}", r.value);
    });
    return templateString;
  }
}
