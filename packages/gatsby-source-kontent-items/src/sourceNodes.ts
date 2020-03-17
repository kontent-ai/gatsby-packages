import { SourceNodesArgs } from "gatsby";
import { CustomPluginOptions, KontentItem, KontentItemElement, RichTextElementLink, RichTextElementImage } from "./types";
import { loadAllKontentItems } from "./client";
import { getKontentItemNodeStringForId, getKontentItemNodeTypeName } from "./naming";

const addPreferredLanguageProperty = (items: Array<KontentItem>, language: string): Array<KontentItem> => {
  for (const item of items) {
    item["preferred_language"] = language;
  }
  return items;
}

const alterRichTextElements = (items: Array<KontentItem>): void => {
  const richTextElements = items
    .flatMap(i => Object.values(i.elements))
    .filter((element: KontentItemElement) => element.type === "rich_text");

  for (const element of richTextElements as KontentItemElement[]) {
    (element.links as RichTextElementLink[]) = Object.keys(element.links).map((key: string) => {
      (element.links as { [key: string]: RichTextElementLink })[key]["link_id"] = key;
      return (element.links as { [key: string]: RichTextElementLink })[key];
    });

    (element.images as RichTextElementImage[]) = Object.keys(element.images).map(key => {
      // key is stored in image_id
      return (element.images as { [key: string]: RichTextElementImage })[key];
    });
  }
}


const getKontentItemLanguageVariantArtifact = (api: SourceNodesArgs, kontentItem: KontentItem): KontentItem => {
  const nodeIdString = getKontentItemNodeStringForId(kontentItem.system.id, kontentItem.preferred_language);
  const nodeContent = JSON.stringify(kontentItem)
  const nodeData: KontentItem = {
    ...kontentItem,
    id: api.createNodeId(nodeIdString),
    children: [],
    internal: {
      type: getKontentItemNodeTypeName(kontentItem.system.type),
      content: nodeContent,
      contentDigest: api.createContentDigest(kontentItem),
    },
  };
  return nodeData;
};


const sourceNodes = async (api: SourceNodesArgs, options: CustomPluginOptions): Promise<void> => {
  for (const language of options.languageCodenames) {
    const kontentItems = await loadAllKontentItems(options.projectId, language);
    addPreferredLanguageProperty(kontentItems, language);
    alterRichTextElements(kontentItems);
    for (const kontentItem of kontentItems) {
      const nodeData = getKontentItemLanguageVariantArtifact(api, kontentItem);
      api.actions.createNode(nodeData);
    }
  }
};


export {
  sourceNodes
};
