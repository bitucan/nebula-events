import { generateCollectionEvent } from "../generateEvent";
import { Collection, events_collections, progress } from "../db";

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

async function processCollections(
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

export { chunkArray, combineStrings, setKeyword, processCollections };
