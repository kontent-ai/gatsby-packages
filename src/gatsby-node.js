require(`@babel/polyfill`);
const _ = require(`lodash`);
const { DeliveryClient } = require(`kentico-cloud-delivery`);

const validation = require(`./validation`);
const itemNodes = require('./itemNodes');
const typeNodes = require('./typeNodes');
const languageVariantsDecorator =
  require('./decorators/languageVariantsDecorator');
const typeItemDecorator =
  require('./decorators/typeItemDecorator');
const linkedItemsElementDecorator =
  require('./decorators/linkedItemsElementDecorator');
const richTextElementDecorator =
  require('./decorators/richTextElementDecorator');
const { customTrackingHeader } = require('./config');


exports.sourceNodes =
  async ({ actions: { createNode }, createNodeId },
    { deliveryClientConfig, languageCodenames }) => {
    console.info(`The 'sourceNodes' API implementation starts.`);
    console.info(`projectId: ${_.get(deliveryClientConfig, 'projectId')}`);
    console.info(`languageCodenames: ${languageCodenames}.`);

    validation.validateLanguageCodenames(languageCodenames);
    const defaultLanguageCodename = languageCodenames[0];
    const nonDefaultLanguageCodenames = languageCodenames.slice(1);

    addHeader(deliveryClientConfig, customTrackingHeader);
    const client = new DeliveryClient(deliveryClientConfig);

    const contentTypeNodes = await typeNodes.get(client, createNodeId);

    const defaultCultureContentItemNodes = await itemNodes.
      getFromDefaultLanguage(
        client,
        defaultLanguageCodename,
        contentTypeNodes,
        createNodeId,
      );

    const nonDefaultLanguageItemNodes = await itemNodes
      .getFromNonDefaultLanguage(
        client,
        nonDefaultLanguageCodenames,
        contentTypeNodes,
        createNodeId,
      );

    languageVariantsDecorator.decorateItemsWithLanguageVariants(
      defaultCultureContentItemNodes,
      nonDefaultLanguageItemNodes
    );

    const allItemNodes = defaultCultureContentItemNodes
      .concat(_.flatten(nonDefaultLanguageItemNodes.values()));
    typeItemDecorator.decorateTypeNodesWithItemLinks(
      allItemNodes,
      contentTypeNodes
    );

    linkedItemsElementDecorator.decorateItemNodesWithLinkedItemsLinks(
      defaultCultureContentItemNodes,
      nonDefaultLanguageItemNodes
    );

    richTextElementDecorator.decorateItemNodesWithRichTextLinkedItemsLinks(
      defaultCultureContentItemNodes,
      nonDefaultLanguageItemNodes
    );

    try {
      contentTypeNodes.forEach(
        (contentTypeNode) => {
          console.info(
            `The 'createNode' API is called.
contentTypeNode.id: ${contentTypeNode.id}`
          );

          createNode(contentTypeNode);
        }
      );
    } catch (error) {
      console.error(
        `Error when creating content type nodes. Details: ${error}`
      );
    }

    console.info(`The 'createNode' API is called for content item nodes.`);
    try {
      defaultCultureContentItemNodes.forEach(
        (contentItemNode) => {
          console.info(
            `The 'createNode' API is called.
contentItemNode.id: ${contentItemNode.id}`
          );

          createNode(contentItemNode);
        }
      );
    } catch (error) {
      console.error(
        `Error when creating content item nodes. Details: ${error}`
      );
    }

    nonDefaultLanguageItemNodes.forEach((languageNodes) => {
      languageNodes.forEach((languageVariantNode) => {
        try {
          createNode(languageVariantNode);

          console.info(
            `The 'createNode' API is called.
languageVariantNode.id: ${languageVariantNode.id}`
          );
        } catch (error) {
          console.error(
            `Error when creating language variant nodes. Details: ${error}`
          );
        }
      });
    });

    console.info(`The 'sourceNodes' API implementation exits.`);
    return;
  };

/**
 *
 * @param {DeliveryClientConfig} deliveryClientConfig
 *  Kentico Cloud JS configuration object
 * @param {IHeader} trackingHeader tracking header name
 */
const addHeader = (deliveryClientConfig, trackingHeader) => {
  let headers = deliveryClientConfig.globalHeaders
    ? _.cloneDeep(deliveryClientConfig.globalHeaders)
    : [];

  if (headers.some((header) => header.header === trackingHeader.header)) {
    console.warn(`Custom HTTP header value with name ${trackingHeader.header}
      will be replaced by the source plugin.
      Use different header name if you want to avoid this behavior;`);
    headers = headers.filter((header) => {
      return header.header !== trackingHeader.header;
    });
  }
  headers.push({
    header: trackingHeader.header,
    value: trackingHeader.value,
  });
  deliveryClientConfig.globalHeaders = headers;
};


