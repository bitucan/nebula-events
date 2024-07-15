import async from "async";
import { loadCollections, type Collection } from "./db";
import dotenv from "dotenv";
import { chunkArray, processCollections } from "./utils";

dotenv.config();

async function main() {
  let records: Collection[] = [];

  records = loadCollections();

  const chunkedRecords: Collection[][] = chunkArray(records, 500);

  async.eachLimit(
    chunkedRecords,
    10,
    (batch, callback) =>
      processCollections(batch, chunkedRecords.indexOf(batch), callback),
    (err) => {
      if (err) {
        console.error("Error processing batches:", err);
      } else {
        console.log("All batches processed successfully");
      }
    }
  );
}

main().catch((err) => console.error("Error in main function:", err));
