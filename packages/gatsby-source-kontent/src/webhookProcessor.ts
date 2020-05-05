import { SourceNodesArgs } from "gatsby"
import { CustomPluginOptions, KontentTaxonomy, KontentItem, KontentType } from "./types"
import * as client from "./client";
import { addPreferredLanguageProperty, alterRichTextElements, getKontentItemLanguageVariantArtifact } from "./sourceNodes.items";
import { getKontentItemNodeStringForId, getKontentTaxonomyTypeName, getKontentTypeTypeName } from "./naming";
import { IWebhookDeliveryResponse, IWebhookMessage } from '@kentico/kontent-webhook-helper';

const parseKontentWebhookBody = (api: SourceNodesArgs): IWebhookDeliveryResponse | null => {
  const parsedBody = api.webhookBody as IWebhookDeliveryResponse;
  const isCorrectStructure = parsedBody?.data?.items?.every(item => item.language && item.id)
    && parsedBody?.message?.api_name
    && parsedBody?.message?.project_id
    && parsedBody?.message?.operation !== null;

  if (isCorrectStructure) {
    return parsedBody;
  }

  return null;
}

const isKontentSupportedWebhook = (message: IWebhookMessage, projectId: string): boolean => {
  const isCorrectProject = message.project_id === projectId;
  const isPreviewWebhook = 'delivery_preview' === message.api_name
    && ['upsert', 'archive'].includes(message.operation);
  const isBuildWebhook = 'delivery_production' === message.api_name
    && ['publish', 'unpublish'].includes(message.operation);
  const isCorrectMessageType = message.type == 'content_item_variant'

  return isCorrectProject
    && (isPreviewWebhook || isBuildWebhook)
    && isCorrectMessageType
};


const handleUpsertItem = async (
  api: SourceNodesArgs,
  pluginConfig: CustomPluginOptions
): Promise<string[]> => {
  const itemInfo = (api.webhookBody as IWebhookDeliveryResponse)?.data.items[0];

  if (!pluginConfig.languageCodenames.includes(itemInfo.language)) {
    api.reporter.verbose(`Cant find specified language ${itemInfo.language} in plugin configuration`);
    return [];
  }

  // TODO could be optimized to by checking the fallback structure and save some requests
  // not recreate the ones that has different system.language
  // be careful on fallback language - verify cz->de->en fallbacks

  const createdItemsIds = [];
  for (const lang of pluginConfig.languageCodenames) {
    const kontentItem = await client.loadKontentItem(itemInfo.id, lang, pluginConfig, true);
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

  const itemInfo = (api.webhookBody as IWebhookDeliveryResponse)?.data.items[0];

  if (!pluginConfig.languageCodenames.includes(itemInfo.language)) {
    api.reporter.verbose(`Cant find specified language ${itemInfo.language} in plugin configuration`);
    return [];
  }

  // TODO could be optimized to by checking the fallback structure and save some requests
  // not recreate the ones that has different system.language
  // be careful on fallback language - verify cz->de->en fallbacks

  const touchedItemsIds = [];
  for (const lang of pluginConfig.languageCodenames) {
    const kontentItem = await client.loadKontentItem(itemInfo.id, lang, pluginConfig, true);
    if (kontentItem === undefined) { //item  was deleted
      const idString = getKontentItemNodeStringForId(itemInfo.id, lang);
      const node = api.getNode(api.createNodeId(idString));
      if (node) {
        touchedItemsIds.push(node.id);
        api.actions.deleteNode({ node });
      }
      continue;
    } else { // fallback version still available
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

  const webhook = parseKontentWebhookBody(api);

  if (webhook === null) {
    api.reporter.verbose('Webhook ignored - webhook does not come from Kontent');
    return;
  }

  if (!isKontentSupportedWebhook(webhook.message, pluginConfig.projectId)) {
    api.reporter.verbose('This Kontent webhook is not handled by the Gatsby source kontent source plugin');
    return;
  }

  api.reporter.verbose(`Handling ${webhook.message.operation} from ${webhook.message.api_name} API`);
  if (webhook.data.items.length > 1) {
    api.reporter.warn(`Webhook contains more than one item! - contains (${webhook.data.items.length})`)
  }

  const processedItemIds: string[] = [];
  if (webhook.message.api_name === 'delivery_preview') {

    // TODO: Webhook header signature (once headers are available)
    // use signatureHelper '@kentico/kontent-webhook-helper'
    // https://github.com/gatsbyjs/gatsby/issues/23593

    if (webhook.message.operation === "upsert") {
      const processedIds = await handleUpsertItem(api, pluginConfig);
      processedItemIds.concat(processedIds);
    }

    if (webhook.message.operation === "archive") {
      const processedIds = await handleDeleteItem(api, pluginConfig);
      processedItemIds.concat(processedIds);
    }
  } else if (webhook.message.api_name === 'delivery_production') {

    // TODO: Webhook header signature (once headers are available)
    // use signatureHelper '@kentico/kontent-webhook-helper'
    // https://github.com/gatsbyjs/gatsby/issues/23593

    if (webhook.message.operation === "publish") {
      const processedIds = await handleUpsertItem(api, pluginConfig);
      processedItemIds.concat(processedIds);
    }

    if (webhook.message.operation === "unpublish") {
      const processedIds = await handleDeleteItem(api, pluginConfig);
      processedItemIds.concat(processedIds);
    }
  } else {
    api.reporter.verbose(`Webhook is not supported yet!`);
    api.reporter.verbose(JSON.stringify(webhook, null, 2));
    return;
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
