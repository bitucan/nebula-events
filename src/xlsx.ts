import xlsx from "xlsx";
// import blackFriday from "../black-friday.json";
import fs from "fs";

interface InputData {
  __EMPTY: number;
  URL: string;
  __EMPTY_1: number;
}

interface OutputData {
  url: string;
}

const excelFilePath =
  "C:\\Users\\Usuario\\Documents\\work\\apps\\scripts\\COLECCIONES eventos.xlsx";
const outputJsonPath = "output.json";

// const data = blackFriday.map((collection) => ({
//   url: collection.url,
// }));
// const worksheet = xlsx.utils.json_to_sheet(data);
// xlsx.utils.book_append_sheet(workbook, worksheet, "Sheet1");

const workbook = xlsx.utils.book_new();

xlsx.writeFile(workbook, "output.xlsx");

interface Collection {
  [key: string]: any;
}

function excelToJson(excelFilePath: string, outputJsonPath: string): void {
  const workbook = xlsx.readFile(excelFilePath);

  const sheetName = "Blackfriday";

  if (!workbook.SheetNames.includes(sheetName)) {
    console.error(`La hoja "${sheetName}" no existe en el archivo Excel.`);
    return;
  }

  const worksheet = workbook.Sheets[sheetName];

  const jsonData: Collection[] = xlsx.utils.sheet_to_json(worksheet);

  fs.writeFileSync(outputJsonPath, JSON.stringify(jsonData, null, 2), "utf-8");
}

function transformJson(inputFilePath: string, outputFilePath: string): void {
  const rawData = fs.readFileSync(inputFilePath, "utf-8");
  const inputData: InputData[] = JSON.parse(rawData);

  const outputData: OutputData[] = inputData.map((item) => ({ url: item.URL }));

  fs.writeFileSync(
    outputFilePath,
    JSON.stringify(outputData, null, 2),
    "utf-8"
  );
}
