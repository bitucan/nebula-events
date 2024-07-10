import async from "async";
import { loadCollections, type Collection } from "./db";
import { progress } from "./db";
import dotenv from "dotenv";
import { chunkArray, processCollections } from "./utils";

dotenv.config();

async function main() {
  const lastIndex = progress.find();
  let records: Collection[] = [];

  if (lastIndex) {
    records = loadCollections(lastIndex);
  } else {
    records = loadCollections();
  }

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
