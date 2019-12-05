const itemNodes = require('./itemNodes');
const _ = require(`lodash`);
const { getNodeInternal } = require('./normalize');
const { DeliveryClient } = require('@kentico/kontent-delivery');
const richTextElementDecorator =
  require('./decorators/richTextElementDecorator');
const linkedItemsElementDecorator =
  require('./decorators/linkedItemsElementDecorator');
const urlSlugElementDecorator =
  require('./decorators/urlSlugElementDecorator');
const { parse, stringify } = require(`flatted/cjs`);

/**
 *
 * @param {Object} webhookBody The request body data passed as a refresh webhook
 * @param {Function} createNodeId Gatsby function for generating node ID
 * @param {Function} createNode Gatsby API function node Creation
 * @param {Function} getNodes Gatsby API function for getting all nodes
 * @param {Function} touchNode
 * Gatsby API function node touch - when no change was performed
 * @param {Boolean} includeRawContent
 * Flag whether the raw `content` field should be included in Gatsby node
 * @param {Boolean} enableLogging Flag to include logging in the output
 * @param {Object} deliveryClientConfig Js SDK Delivery client configuration
 */
const performUpdate = (
  webhookBody,
  createNodeId,
  createNode,
  getNodes,
  touchNode,
  includeRawContent,
  enableLogging,
  deliveryClientConfig,
) => {
  const kontentItemNodes = getNodes()
    .filter((item) =>
      item.internal.owner === '@kentico/gatsby-source-kontent'
      && item.internal.type.startsWith(`KontentItem`));

  const preferredLanguage = webhookBody.message.selectedLanguage;
  const itemToUpdate = webhookBody.data.response.item;
  const itemToUpdateNodeId = itemNodes.createItemNodeId(
    itemToUpdate.system.codename,
    preferredLanguage,
    createNodeId);

  // Don't use the item.system.language because
  // it would differ when the language fallback was used.
  // For gatsby these are two different language variants
  // (figure out how to handle that for update).
  // If (item.system.language !== preferredLanguage)
  for (const itemNode of kontentItemNodes) {
    if (itemToUpdateNodeId !== itemNode.id) {
      touchNode(itemNode);
    } else { // Update item
      // TODO is is possible to get more then one codename at one time?
      // What os this situation ? auto generated url_slug also make two changes
      // const itemChangedCodenames = webhookBody.message.elementCodenames;
      // TODO verify if necessary to clone
      const response = _.cloneDeep(webhookBody.data.response);
      const baseResponse = {
        data: response,
        headers: [],
        response,
        status: 200,
      };
      const client = new DeliveryClient(deliveryClientConfig);
      const resolvedItem = client.mappingService
        .viewContentItemResponse(baseResponse, {});

      // TODO call resolvers for Rich text and URL slugs + parse and stringify
      richTextElementDecorator
        .resolveData([resolvedItem.item]);
      urlSlugElementDecorator
        .resolveUrls([resolvedItem.item]);

      const resolvedItemFlattened = parse(stringify(resolvedItem.item));

      resolvedItemFlattened.preferred_language = preferredLanguage;
      // TODO  additional data + used by content items
      // - possible to pass from old item?
      // definitely linked item and content items in rich text needs to be
      // added to used_by_content_items when adding (removing)
      // the item from element value
      const updatedItem = itemNodes.createContentItemNode(
        itemToUpdateNodeId,
        resolvedItemFlattened,
        itemNode.contentType___NODE,
        includeRawContent
      );

      // TODO verify id necessary
      updatedItem.internal = getNodeInternal(
        'item',
        itemToUpdate,
        includeRawContent,
        updatedItem.system.type
      );

      // TODO decorateTypeNodesWithItemLinks probably not necessary
      // (using  itemNode.contentType___NODE above)
      // TODO decorateItemsWithLanguageVariants
      updatedItem.otherLanguages___NODE = itemNode.otherLanguages___NODE;
      // TODO decorateItemNodesWithLinkedItemsLinks
      const sameLanguagesItemNodes = kontentItemNodes.filter((item) =>
        item.preferred_language == updatedItem.preferred_language);
      linkedItemsElementDecorator.decorateItemNodeWithLinkedItemsLinks(
        updatedItem,
        sameLanguagesItemNodes
      );
      // TODO decorateItemNodesWithRichTextLinkedItemsLinks
      richTextElementDecorator.decorateItemNodeWithRichTextLinkedItemsLinks(
        updatedItem,
        sameLanguagesItemNodes
      );


      createNode(updatedItem);

      if (enableLogging) {
        console.info(
          `Content item ${itemToUpdate.system.codename} was updated`
        );
      }
    }
  }
};

module.exports = {
  performUpdate,
};
