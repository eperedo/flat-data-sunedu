import {
  xlsx,
  readXLSX,
  writeJSON,
} from "https://deno.land/x/flat@0.0.10/mod.ts";

const workbook = await readXLSX("sunedu.xlsx");
const sheetData = workbook.Sheets[workbook.SheetNames[0]];
const jsonString = await xlsx.utils.sheet_to_json(sheetData);

await writeJSON("sunedu.json", jsonString);
