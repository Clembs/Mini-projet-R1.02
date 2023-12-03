import { readdirSync, readFileSync, writeFileSync } from "node:fs";

function getAllHtmlFiles(dirPath, arrayOfFiles = []) {
  const files = readdirSync(dirPath);

  //recursively loop through directories
  for (const file of files) {
    if (file.includes(".html")) {
      arrayOfFiles.push(`${dirPath}/${file}`);
    } else if (readdirSync(`${dirPath}/${file}`).length > 0)
      arrayOfFiles = getAllHtmlFiles(`${dirPath}/${file}`, arrayOfFiles);
  }

  return arrayOfFiles;
}

const htmlTemplates = getAllHtmlFiles("./src/templates");
const components = getAllHtmlFiles("./src/components");

htmlTemplates.forEach((f) => {
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
  // .replaceAll('href="./', 'href="/public/')
  // .replaceAll('src="./', 'src="/public/');

  writeFileSync(`./public/${f.replace("./src/templates/", "")}`, html, "utf8");
});
