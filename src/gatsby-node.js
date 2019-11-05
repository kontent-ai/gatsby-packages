require(`@babel/polyfill`);

const _ = require(`lodash`);
const { DeliveryClient } = require(`@kentico/kontent-delivery`);

const validation = require(`./validation`);
const itemNodes = require('./itemNodes');
const typeNodes = require('./typeNodes');
const typeNodesSchema = require('./typeNodesSchema');

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
  async ({ actions: { createNode, createTypes }, createNodeId, schema },
    { deliveryClientConfig,
      languageCodenames,
      enableLogging = false,
      includeRawContent = false,
    }
  ) => {
    if (enableLogging) {
      console.info(`Generating Kentico Kontent nodes for projectId:\
 ${_.get(deliveryClientConfig, 'projectId')}`);
      console.info(`Provided language codenames: ${languageCodenames}.`);
    }

    validation.validateLanguageCodenames(languageCodenames);
    const defaultLanguageCodename = languageCodenames[0];
    const nonDefaultLanguageCodenames = languageCodenames.slice(1);

    addHeader(deliveryClientConfig, customTrackingHeader);

    const client = new DeliveryClient(deliveryClientConfig);
    const contentTypeNodes = await typeNodes.get(
      client,
      createNodeId,
      includeRawContent
    );

    if (enableLogging) {
      console.info(
        `Creating type nodes schema.`
      );
    }
    await typeNodesSchema.createTypeNodesSchema(
      client,
      schema,
      createTypes,
    );

    const defaultCultureContentItemNodes = await itemNodes.
      getFromDefaultLanguage(
        client,
        defaultLanguageCodename,
        contentTypeNodes,
        createNodeId,
        includeRawContent,
      );

    const nonDefaultLanguageItemNodes = await itemNodes
      .getFromNonDefaultLanguage(
        client,
        nonDefaultLanguageCodenames,
        contentTypeNodes,
        createNodeId,
        includeRawContent,
      );

    languageVariantsDecorator.decorateItemsWithLanguageVariants(
      defaultCultureContentItemNodes,
      nonDefaultLanguageItemNodes
    );

    const allItemNodes = defaultCultureContentItemNodes
      .concat(_.flatten(Object.values(nonDefaultLanguageItemNodes)));
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

    if (enableLogging) {
      console.info(`Creating content type nodes.`);
    }
    createNodes(contentTypeNodes, createNode);

    if (enableLogging) {
      console.info(`Creating content item nodes for default language.`);
    }
    createNodes(defaultCultureContentItemNodes, createNode);

    if (enableLogging) {
      console.info(`Creating content item nodes for non-default languages.`);
    }
    let nonDefaultLanguagesCount = 0;
    Object.values(nonDefaultLanguageItemNodes).forEach((languageNodes) => {
      createNodes(languageNodes, createNode);
      nonDefaultLanguagesCount += languageNodes.length;
    });

    const typeNodesCount = contentTypeNodes.length;
    const itemsCount = contentTypeNodes.length + nonDefaultLanguagesCount;
    if (enableLogging) {
      console.info(`Kentico Kontent nodes generation finished.`);
      console.info(`${typeNodesCount} Kontent types item imported.`);
      console.info(`${itemsCount} Kontent items imported.`);
    }
    return;
  };

/**
 *
 * @param {DeliveryClientConfig} deliveryClientConfig
 *  Kentico Kontent JS configuration object
 * @param {IHeader} trackingHeader tracking header name
 */
const addHeader = (deliveryClientConfig, trackingHeader) => {
  deliveryClientConfig.globalQueryConfig =
    deliveryClientConfig.globalQueryConfig || {};

  if (!deliveryClientConfig.globalQueryConfig.customHeaders) {
    deliveryClientConfig.globalQueryConfig.customHeaders = [trackingHeader];
    return;
  }

  let headers = _.cloneDeep(
    deliveryClientConfig
      .globalQueryConfig
      .customHeaders
  );

  if (headers.some((header) => header.header === trackingHeader.header)) {
    console.warn(`Custom HTTP header value with name ${trackingHeader.header}
        will be replaced by the source plugin.
        Use different header name if you want to avoid this behavior;`);
    headers = headers.filter((header) =>
      header.header !== trackingHeader.header);
  }

  headers.push(trackingHeader);
  deliveryClientConfig.globalQueryConfig.customHeaders = headers;
};

/**
 * Call @see createNode function  for all items in @see nodes.
 * @param {Array} nodes Gatsby nodes to create
 * @param {Function} createNode Gatsby API method for Node creation.
 */
const createNodes = (nodes, createNode) => {
  try {
    nodes.forEach((node) => {
      createNode(node);
    });
  } catch (error) {
    console.error(`Error when creating nodes. Details: ${error}`);
  }
};
