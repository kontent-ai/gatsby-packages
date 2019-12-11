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
const { customTrackingHeader, addHeader } = require('./config');
const { performUpdate } = require('./preview');

exports.createSchemaCustomization = async (api, pluginConfig) => {
  const {
    actions: {
      createTypes,
    },
    schema,
  } = api;

  const {
    deliveryClientConfig,
    enableLogging = false,
  } = pluginConfig;

  const kontentClientConfig =
    addHeader(deliveryClientConfig, customTrackingHeader);

  const client = new DeliveryClient(kontentClientConfig);


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
};

exports.sourceNodes =
  async (api, pluginConfig) => {
    const {
      actions: {
        createNode,
        touchNode,
      },
      createNodeId,
      webhookBody,
      getNodes,
    } = api;

    const {
      deliveryClientConfig,
      languageCodenames,
      enableLogging = false,
      includeRawContent = false,
    } = pluginConfig;

    const kontentClientConfig =
    addHeader(deliveryClientConfig, customTrackingHeader);


    const operation = _.get(webhookBody, 'message.operation');
    if (operation) {
      if (enableLogging) {
        console.info(`Refresh run.`);
      }

      switch (operation) {
        case 'update': {
          console.log('Update run');
          performUpdate(
            webhookBody,
            createNodeId,
            createNode,
            getNodes,
            touchNode,
            includeRawContent,
            enableLogging,
            kontentClientConfig,
          );
          break;
        }
        default: {
          break;
        }
      }
      return;
    }

    if (enableLogging) {
      console.info(`Generating Kentico Kontent nodes for projectId:\
 ${_.get(kontentClientConfig, 'projectId')}`);
      console.info(`Provided language codenames: ${languageCodenames}.`);
    }

    validation.validateLanguageCodenames(languageCodenames);
    const defaultLanguageCodename = languageCodenames[0];
    const nonDefaultLanguageCodenames = languageCodenames.slice(1);

    const client = new DeliveryClient(kontentClientConfig);

    const contentTypeNodes = await typeNodes.get(
      client,
      createNodeId,
      includeRawContent
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
    const itemsCount =
      defaultCultureContentItemNodes.length + nonDefaultLanguagesCount;
    if (enableLogging) {
      console.info(`Kentico Kontent nodes generation finished.`);
      console.info(`${typeNodesCount} Kontent types item imported.`);
      console.info(`${itemsCount} Kontent items imported.`);
    }
    return;
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
