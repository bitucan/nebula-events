import fs from "fs";

const rawData: any = fs.readFileSync("togenerate.json");
const data = JSON.parse(rawData);

// // Dividir el JSON en dos partes
const midpoint = Math.ceil(data.length / 2);
const firstHalf = data.slice(0, midpoint);
const secondHalf = data.slice(midpoint);

// // Escribir las dos partes en dos archivos separados
fs.writeFileSync("firstHalf.json", JSON.stringify(firstHalf, null, 2));
fs.writeFileSync("secondHalf.json", JSON.stringify(secondHalf, null, 2));
