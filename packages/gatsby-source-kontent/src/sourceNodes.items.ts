import { SourceNodesArgs } from 'gatsby';
import {
  CustomPluginOptions,
  KontentItem,
  KontentItemElement,
  RichTextElementLink,
  RichTextElementImage,
} from './types';
import { loadAllKontentItems } from './client';
import {
  getKontentItemNodeStringForId,
  getKontentItemNodeTypeName,
  PREFERRED_LANGUAGE_IDENTIFIER,
} from './naming';
import _ from 'lodash';

const addPreferredLanguageProperty = (
  items: Array<KontentItem>,
  language: string,
): Array<KontentItem> => {
  for (const item of items) {
    item[PREFERRED_LANGUAGE_IDENTIFIER] = language;
  }
  return items;
};

const alterRichTextElements = (items: Array<KontentItem>): void => {
  const richTextElements = _.flatMap(items, item =>
    Object.values(item.elements),
  ).filter((element: KontentItemElement) => element.type === 'rich_text');

  for (const element of richTextElements as KontentItemElement[]) {
    (element.links as RichTextElementLink[]) = Object.keys(element.links).map(
      (key: string) => {
        (element.links as { [key: string]: RichTextElementLink })[key][
          'link_id'
        ] = key;
        return (element.links as { [key: string]: RichTextElementLink })[key];
      },
    );

    (element.images as RichTextElementImage[]) = Object.keys(
      element.images,
    ).map(key => {
      // key is stored in image_id
      return (element.images as { [key: string]: RichTextElementImage })[key];
    });
  }
};

const getKontentItemLanguageVariantArtifact = (
  api: SourceNodesArgs,
  kontentItem: KontentItem,
  includeRawContent: boolean,
): KontentItem => {
  const nodeIdString = getKontentItemNodeStringForId(
    kontentItem.system.id,
    kontentItem[PREFERRED_LANGUAGE_IDENTIFIER],
  );
  const nodeData: KontentItem = {
    ...kontentItem,
    id: api.createNodeId(nodeIdString),
    children: [],
    internal: {
      type: getKontentItemNodeTypeName(kontentItem.system.type),
      contentDigest: api.createContentDigest(kontentItem),
    },
  };
  if (includeRawContent) {
    nodeData.internal.content = JSON.stringify(kontentItem);
  }
  return nodeData;
};

const sourceNodes = async (
  api: SourceNodesArgs,
  options: CustomPluginOptions,
): Promise<string[]> => {
  const kontentItemTypes = new Set<string>();
  for (const language of options.languageCodenames) {
    const kontentItems = await loadAllKontentItems(options, language);
    addPreferredLanguageProperty(kontentItems, language);
    alterRichTextElements(kontentItems);
    for (const kontentItem of kontentItems) {
      const nodeData = getKontentItemLanguageVariantArtifact(
        api,
        kontentItem,
        options.includeRawContent,
      );
      kontentItemTypes.add(nodeData.internal.type);
      api.actions.createNode(nodeData);
    }
  }
  return Array.from(kontentItemTypes);
};

export {
  sourceNodes as kontentItemsSourceNodes,
  addPreferredLanguageProperty,
  alterRichTextElements,
  getKontentItemLanguageVariantArtifact
};
