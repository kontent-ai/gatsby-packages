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
    console.info(`Generating Kentico Cloud nodes for projectId:\
 ${_.get(deliveryClientConfig, 'projectId')}`);
    console.info(`Provided language codenames: ${languageCodenames}.`);

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

    console.info(`Creating content type nodes.`);
    createNodes(contentTypeNodes, createNode);

    console.info(`Creating content item nodes for default language.`);
    createNodes(defaultCultureContentItemNodes, createNode);

    console.info(`Creating content item nodes for non-default languages.`);
    nonDefaultLanguageItemNodes.forEach((languageNodes) => {
      createNodes(languageNodes, createNode);
    });

    console.info(`Kentico Cloud nodes generation finished.`);
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

/**
 * Call @see createNode function  for all items in @see nodes.
 * @param {Array} nodes Gatsby nodes to create
 * @param {Function} createNode Gatsby API method for Node creation.
 */
const createNodes = (nodes, createNode) => {
  try {
    nodes.forEach((contentTypeNode) => {
      const nodeId = contentTypeNode.id;
      const nodeCodeName = contentTypeNode.system.codename;
      console.info(`Creating node: ${nodeId}(${nodeCodeName})`);
      createNode(contentTypeNode);
    });
  } catch (error) {
    console.error(`Error when creating nodes. Details: ${error}`);
  }
};
