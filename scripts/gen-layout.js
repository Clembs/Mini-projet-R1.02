import { readdirSync, readFileSync, writeFileSync } from "node:fs";

function getAllHtmlFiles(dirPath, arrayOfFiles = []) {
  const files = readdirSync(dirPath);

  files.forEach(function (file) {
    if (file.includes(".html")) {
      arrayOfFiles.push(`${dirPath}/${file}`);
    } else if (file.includes(".")) {
      // ignore
    } else {
      arrayOfFiles = getAllHtmlFiles(`${dirPath}/${file}`, arrayOfFiles);
    }
  });

  return arrayOfFiles;
}

const htmlTemplates = getAllHtmlFiles("./src/templates");
const components = getAllHtmlFiles("./src/components");

htmlTemplates.forEach((f) => {
  const fileName = f.split("/").pop();
  const rawHtml = readFileSync(f, "utf8");

  const html = rawHtml.replace(
    // match all <!-- {componentName} -->
    /<!--\s*([a-zA-Z0-9]+)\s*-->/g,
    (match, componentName) => {
      const component = components.find((c) =>
        c.includes(`${componentName}.html`)
      );
      if (!component) {
        return match;
      }
      return readFileSync(component, "utf8");
    }
  );

  writeFileSync(`./public/${fileName}`, html, "utf8");
});
