//@ts-check
import { readFileSync, writeFileSync } from "node:fs";

const htmlTemplate = readFileSync("./src/competences/template.html", "utf8");
const competences = JSON.parse(
  readFileSync("./src/competences/competences.json", "utf8")
);
const ressources = JSON.parse(
  readFileSync("./src/competences/ressources.json", "utf8")
);

competences.forEach((competence, i) => {
  // {
  //   "code": "dev1",
  //   "nom": "Réaliser un développement d'application",
  //   "apprentissages": [
  //     "Développer des applications informatiques simples",
  //     "Partir des exigences et aller jusqu'à une application complète",
  //     "Adapter des applications sur un ensemble de supports (embarqué, web, mobile, IoT…)"
  //   ],
  //   "resources": ["R1.01", "R1.02", "R1.10"],
  //   "coeffs": [42, 12, 6],
  //   "sae": {
  //     "code": "S1.01",
  //     "nom": "Implémentation d'un besoin client",
  //     "description": "En partant d'un besoin exprimé par un client, l'objectif est de réaliser une application qui réponde à ce besoin."
  //   }
  // },
  const html = htmlTemplate
    .replaceAll("{i}", i + 1)
    .replaceAll("{competence.code}", competence.code)
    .replaceAll("{competence.nom}", competence.nom)
    .replaceAll(
      "{competence.apprentissages}",
      competence.apprentissages.map((a) => `<li>${a}</li>`).join("\n")
    )
    .replaceAll(
      "{competence.resources}",
      competence.resources.map((r) => `<th>${r}</th>`).join("\n")
    )
    .replaceAll(
      "{competence.coeffs}",
      competence.coeffs.map((c) => `<td>${c}%</td>`).join("\n")
    )
    .replaceAll("{competence.sae.code}", competence.sae.code)
    .replaceAll("{competence.sae.nom}", competence.sae.nom)
    .replaceAll("{competence.sae.description}", competence.sae.description)
    .replaceAll(
      "{competence.ressourcesDetail}",
      competence.resources
        .map((r) => {
          const resource = ressources.find((ressource) => ressource.code === r);
          const competence = competences.filter((competence) =>
            competence.resources.includes(resource.code)
          );

          return `
        <section class="ressource">
          <header>
            <span class="code">${resource.code}</span>
            <h3>${resource.nom}</h3>
          </header>
          <p>${resource.description}</p>
          <h4>Apparentissages critiques liés :</h4>
          <ul>
            ${competence
              .map(
                (c) => `<li>
            <b>${c.nom}</b>
            <ul>
              ${c.apprentissages.map((a) => `<li>${a}</li>`).join("\n")}
            </ul>
            </li>`
              )
              .join("\n")}
          </ul>
        </section>
      `;
        })
        .join("\n")
    );

  writeFileSync(
    `./src/templates/competences-${competence.code}.html`,
    html,
    "utf8"
  );
});
