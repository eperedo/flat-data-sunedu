const fs = require("fs");
const excelToJson = require("convert-excel-to-json");

console.log("Argv is", process.argv);

const slug = require("slug");

const excludedWords = ["S.A.C.", "II", "Y", "S.A."];

function capitalize(item) {
  return item.charAt(0).toUpperCase() + item.slice(1).toLowerCase();
}

function manyWords(text) {
  const words = text.split(" ");
  const r = words.reduce((acum, item, index) => {
    if (!excludedWords.includes(item)) {
      if (index === words.length - 1) {
        acum += `${capitalize(item)}`;
      } else {
        acum += `${capitalize(item)} `;
      }
    } else {
      acum += index === words.length - 1 ? item : `${item} `;
    }
    return acum;
  }, "");
  return r;
}

function processExcel() {
  const result = excelToJson({
    sourceFile: "sunedu.xlsx",
    sheets: ["Hoja1"],
    header: {
      rows: 1,
    },
    columnToKey: {
      A: "code",
      B: "fullName",
      C: "typeEntity",
      D: "statusLicense",
      E: "periodLicense",
      F: "region",
      G: "province",
      H: "district",
      I: "latitude",
      J: "longitude",
    },
  });

  const final = result["Hoja1"].map((item) => {
    const newItem = { ...item };
    if (newItem.fullName) {
      newItem.fullName = manyWords(newItem.fullName);
    }
    newItem.region = manyWords(newItem.region);
    newItem.district = manyWords(newItem.district);
    newItem.province = manyWords(newItem.province);
    newItem.statusLicense = manyWords(newItem.statusLicense);
    newItem.typeEntity = manyWords(newItem.typeEntity);
    newItem.slug = slug(newItem.fullName);

    return newItem;
  });

  fs.writeFileSync("sunedu_latest.json", JSON.stringify(final, null, " "), {
    encoding: "utf-8",
  });

  return final;
}

processExcel();
