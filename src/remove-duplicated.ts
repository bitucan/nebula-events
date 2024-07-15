import { combineStrings } from "./utils";
import fs from "fs";

type Collection = {
  id: string;
  created_by: string;
  url: string;
  category: string;
  title_content_top: string;
  content_top: string;
  title_content_bottom: string;
  content_bottom: string;
  meta_title: string;
  meta_description: string;
  hyper_links: string[];
  internal_links: string[];
  keywords: string;
  keyword: string;
  text_reference: string;
  state: string;
  brand: string;
  saved_at: string;
  created_at: string;
  updated_at: string;
  workspace_id: string;
  banner_id: string;
  tree_category_id: string[];
  tree_category_name: string[];
  products_ids: string[];
  event: string;
};

function removeDuplicatesFromLists(list1: any[], list2: any[]): any[] {
  const urlSet: Set<string> = new Set(list2.map((item) => item.url));
  const uniqueItems: any[] = list1.filter((item) => !urlSet.has(item.url));

  return uniqueItems;
}

fs.readFile(
  "C:\\Users\\Usuario\\Documents\\work\\apps\\scripts\\collections.json",
  "utf8",
  (err, data) => {
    if (err) {
      console.error("Error al leer el archivo:", err);
      return;
    }

    try {
      const collections = JSON.parse(data);

      const mapped = collections.map((item: any, index: number) => ({
        index: index + 1,
        id: item.id,
        created_by: item.createdBy,
        url: combineStrings(item?.urlIndexed, "black-friday"),
        category: item.category,
        title_content_top: item.titleContentTop,
        content_top: item.contentTop,
        title_content_bottom: item.titleContentBottom,
        content_bottom: item.contentBottom,
        meta_title: item.metaTitle,
        meta_description: item.metaDescription,
        hyper_links: [item.hyperLink],
        keywords: item.keywords,
        state: item.state,
        internal_links: [item.internalLinks],
        text_reference: item.textReference,
      }));

      // const removed = removeDuplicatesFromLists(mapped, black);

      // fs.writeFileSync(
      //   "togenerate.json",
      //   JSON.stringify(removed, null, 2),
      //   "utf-8"
      // );
      // console.log("removed", removed);
    } catch (err) {
      console.error("Error al parsear el JSON:", err);
    }
  }
);
