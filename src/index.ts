import async from "async";
import { type Collection } from "./db";
import { v4 as uuid } from "uuid";
import { collections, events_collections, progress } from "./db";
import dotenv from "dotenv";
import { nebula } from "./nebula";

dotenv.config();

function loadRecords(lastIdProcessed?: number): Collection[] {
  if (lastIdProcessed) {
    return collections.find({ index: { $gt: lastIdProcessed } });
  } else {
    return collections.find();
  }
}

function chunkArray(array: Collection[], size: number): Collection[][] {
  const chunkedArr: Collection[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunkedArr.push(array.slice(i, i + size));
  }
  return chunkedArr;
}

function combineStrings(str1: string, str2: string) {
  return str1.replace(/-+$/, "") + "-" + str2.replace(/^-+/, "");
}

function setKeyword(keywords: string, keyword: string) {
  let palabrasClave = keywords.split(", ");

  if (palabrasClave.length > 3) {
    palabrasClave = palabrasClave.slice(0, 3);
  }

  palabrasClave.push(keyword);

  let resultado = palabrasClave.join(", ");

  return resultado;
}

const generateCollectionEvent = async (collection: Collection) => {
  try {
    const res = await nebula.post("http://localhost:3111/v1/events/content", {
      collection,
    });

    return {
      ...collection,
      workspace_id: "",
      id: uuid(),
      meta_title: res.data.meta_title,
      meta_description: res.data.meta_description,
      title_content_bottom: res.data.title_content_bottom,
      content_bottom: res.data.content_bottom,
      content_top: res.data.content_top,
      banner_id: "",
      tree_category_id: "",
      tree_category_name: "",
      products_ids: "",
    };
  } catch (error) {
    console.error("Error al enviar evento:", error);
    throw error;
  }
};

async function processBatch(
  batch: Collection[],
  batchIndex: number,
  callback: (err: Error | null) => void
): Promise<void> {
  try {
    for (let i = 0; i < batch.length; i++) {
      const record = batch[i];

      try {
        const collection = await generateCollectionEvent({
          ...record,
          url: combineStrings(record.url, "black-friday"),
          keywords: setKeyword(record.keywords, "black friday"),
        });

        events_collections
          .create({
            ...collection,
            url: combineStrings(record.url, "black-friday"),
            keywords: setKeyword(record.keywords, "black friday"),
          })
          .save();

        await new Promise((resolve) => setTimeout(resolve, 500));
      } catch (err) {
        throw {
          error: err,
          index: record.index,
          id: record.id,
          batchIndex,
        };
      }
    }

    callback(null);
  } catch (error: any) {
    progress.create({ index: error.index, error }).save();
    callback(error.error);
  }
}

async function main() {
  const lastIndex = progress.find();
  let records: Collection[] = [];

  if (lastIndex) {
    records = loadRecords(lastIndex);
  } else {
    records = loadRecords();
  }

  const chunkedRecords: Collection[][] = chunkArray(records, 500);

  async.eachLimit(
    chunkedRecords,
    10,
    (batch, callback) =>
      processBatch(batch, chunkedRecords.indexOf(batch), callback),
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
