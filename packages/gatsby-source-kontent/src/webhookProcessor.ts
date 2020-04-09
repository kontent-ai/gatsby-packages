import { SourceNodesArgs } from "gatsby"
import { CustomPluginOptions, KontentTaxonomy, KontentItem, KontentType } from "./types"
import * as client from "./client";
import { addPreferredLanguageProperty, alterRichTextElements, getKontentItemLanguageVariantArtifact } from "./sourceNodes.items";
import { getKontentItemNodeStringForId, getKontentTaxonomyTypeName, getKontentTypeTypeName } from "./naming";

interface WebhookBody {
  data: WebhookData;
  message: WebhookBodyMessage;
}

interface WebhookBodyMessage {
  api_name: string;
  type: string;
  operation: string;
}

interface WebhookData {
  items: {
    id: string;
    codename: string;
    language: string;
    type: string;
  }[];
}

const isCreateItemAction = ({ operation, type }: WebhookBodyMessage): boolean => (
  ["create", "restore"].includes(operation)
  && ["content_item", "content_item_variant"].includes(type)
);

const isUpdateItemAction = ({ operation, type }: WebhookBodyMessage): boolean => (
  operation === 'update'
  && ["content_item", "content_item_variant"].includes(type)
);

const isDeleteItemAction = ({ operation, type }: WebhookBodyMessage): boolean => (
  operation === 'archive'
  && ["content_item", "content_item_variant"].includes(type)
);

const handleUpsertItem = async (
  api: SourceNodesArgs,
  pluginConfig: CustomPluginOptions
): Promise<string[]> => {
  const itemInfo = (api.webhookBody as WebhookBody)?.data.items[0];

  // TODO uncomment once the preview webhook is ready
  // if (!pluginConfig.languageCodenames.includes(itemInfo.language)) {
  //   api.reporter.verbose(`Cant find specified language ${itemInfo.language} in plugin configuration`);
  //   return;
  // }

  // TODO could be optimized to by checking the fallback structure and save some requests
  // not recreate the ones that has different system.language
  // be careful on fallback language - verify cz->de->en fallbacks

  // TODO remove that adjustment when preview is ready
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  itemInfo.id = (api.webhookBody as any).data.items[0].item.id;

  const createdItemsIds = [];
  for (const lang of pluginConfig.languageCodenames) {
    const kontentItem = await client.loadKontentItem(itemInfo.id, lang, pluginConfig);
    if (kontentItem === undefined) {
      api.reporter.verbose(`Kontent item (${itemInfo.id}) language variant (${lang}) not found on the kontent delivery API for update`);
      continue;
    }
    addPreferredLanguageProperty([kontentItem], lang);
    alterRichTextElements([kontentItem]);
    const nodeData = getKontentItemLanguageVariantArtifact(
      api,
      kontentItem,
      pluginConfig.includeRawContent,
    );
    createdItemsIds.push(nodeData.id);
    api.actions.createNode(nodeData);
  }

  return createdItemsIds;
}

const handleDeleteItem = async (
  api: SourceNodesArgs,
  pluginConfig: CustomPluginOptions
): Promise<string[]> => {

  const itemInfo = (api.webhookBody as WebhookBody)?.data.items[0];

  // TODO uncomment once the preview webhook is ready
  // if (!pluginConfig.languageCodenames.includes(itemInfo.language)) {
  //   api.reporter.verbose(`Cant find specified language ${itemInfo.language} in plugin configuration`);
  //   return;
  // }

  // TODO could be optimized to by checking the fallback structure and save some requests
  // not recreate the ones that has different system.language
  // be careful on fallback language - verify cz->de->en fallbacks

  // TODO remove that adjustment when preview is ready
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  itemInfo.id = (api.webhookBody as any).data.items[0].item.id;

  const touchedItemsIds = [];
  for (const lang of pluginConfig.languageCodenames) {
    const kontentItem = await client.loadKontentItem(itemInfo.id, lang, pluginConfig);
    if (kontentItem === undefined) { // was deleted
      const idString = getKontentItemNodeStringForId(itemInfo.id, lang);
      const node = api.getNode(api.createNodeId(idString));
      if (node) {
        touchedItemsIds.push(node.id);
        api.actions.deleteNode({ node });
      }
      continue;
    } else { // fallback/still here
      addPreferredLanguageProperty([kontentItem], lang);
      alterRichTextElements([kontentItem]);
      const nodeData = getKontentItemLanguageVariantArtifact(
        api,
        kontentItem,
        pluginConfig.includeRawContent,
      );
      touchedItemsIds.push(nodeData.id);
      api.actions.createNode(nodeData);
    }
  }

  return touchedItemsIds;
}

const handleIncomingWebhook = async (
  api: SourceNodesArgs,
  pluginConfig: CustomPluginOptions,
  itemTypes: string[],
): Promise<void> => {
  const webhook = api.webhookBody as WebhookBody;
  const message = webhook.message;

  // TODO uncomment once preview webhook is turned on
  // if (message.api_name != 'delivery_preview') {
  //   api.reporter.verbose('Webhook is not sent from delivery preview.');
  //   return;
  // }

  const processedItemIds: string[] = [];
  // TODO maybe merge create + update
  if (isCreateItemAction(message) || isUpdateItemAction(message)) {
    // TODO question - could create contains more than one item?
    const processedIds = await handleUpsertItem(api, pluginConfig);
    processedItemIds.concat(processedIds);
  }

  if (isDeleteItemAction(message)) {
    const processedIds = await handleDeleteItem(api, pluginConfig);
    processedItemIds.concat(processedIds);
  }


  for (const itemType of itemTypes) {
    const itemsToTouch: KontentItem[] = api.getNodesByType(itemType);
    itemsToTouch
      .filter(item => processedItemIds.includes(item.id))
      .forEach(itemToTouch => api.actions.touchNode({ nodeId: itemToTouch.id }))
  }

  if (pluginConfig.includeTaxonomies) {
    const taxonomies: KontentTaxonomy[] = api.getNodesByType(getKontentTaxonomyTypeName());
    for (const taxonomy of taxonomies) {
      api.actions.touchNode({ nodeId: taxonomy.id });
    }
  }

  if (pluginConfig.includeTypes) {
    const types: KontentType[] = api.getNodesByType(getKontentTypeTypeName());
    for (const type of types) {
      api.actions.touchNode({ nodeId: type.id });
    }
  }
}

export {
  handleIncomingWebhook
}