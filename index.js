"use strict";
const through = require("through2");
const PluginError = require("plugin-error");

const PLUGIN_NAME = "gulp-source-to-html";

/**
 * @param {Object} [options]
 *
 *
 */
const gulpSourceToHTML = (pluginOptions = {}) => {
   return through.obj((file, _, callback) => {
      if (file.isNull()) {
         return callback(null, file);
      }

      if (file.isStream()) {
         return callback(new PluginError(PLUGIN_NAME, "Streaming not supported"));
      }

      const defaultOptions = { rootpath: file.base, extensions: [".jpg", ".png", ".jpeg", ".JPG", ".PNG", ".JPEG"], newExtensions: [".webp"] };
      const options = { ...defaultOptions, ...pluginOptions };
      (async () => {
         try {
            let reImg3 = /<img.*(\sdata-src|\ssrc)=[\'\"](\S*)[\'\"].*\s*(\/>|<\/picture>)/;
            let reImg4 = /<img.*\n*?\/>/;

            let SplitImg = "<img "; // Строка, которой разбивает на массивы во второй раз.

            const data = file.contents;

            let newData = data
               .toString()
               .split(SplitImg) // Разбили на подстроки по SplitImg
               .map(function (line) {
                  // Создали новые массивы таких вхождений
                  let newline = SplitImg + line;

                  if (reImg3.test(newline)) {
                     //    // Оставили только картинки
                     let limage = newline.match(reImg4); // img целиком
                     let lineA = newline.match(reImg3);
                     let lpath = lineA[2]; // Путь к файлу
                     let lsrc = lineA[1]; // src или data-src
                     let lpic = lineA[3]; // picture или нет

                     let src = "srcset";
                     if (lsrc.includes("data-")) src = "data-srcset"; // Если содержит data
                     let newHTML = "";

                     options.newExtensions.forEach(function (item) {
                        // для каждого нового расширения
                        for (let k in options.extensions) {
                           // Находим нужное расширение из доступных
                           lpath = lpath.replace(options.extensions[k], item);
                        }
                        newHTML += "<source " + src + '="' + lpath + '" type="image/' + item.slice(1) + '">';
                        lpath = lineA[2];
                     });
                     newHTML += limage;
                     if (!lpic.includes("/picture")) newHTML = `<picture>\n${newHTML}\n</picture>`; // Если не в picture
                     line = newline.replace(limage, newHTML); // Заменяем новой строкой весь тэг img
                  }
                  return line;
               })
               .join("");

            file.contents = Buffer.from(newData);
            callback(null, file);
         } catch (err) {
            callback(new PluginError(PLUGIN_NAME, err));
         }
      })();
   });
};

module.exports = gulpSourceToHTML;
