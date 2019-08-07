const { parse, stringify } = require(`flatted/cjs`);
const _ = require('lodash');
const changeCase = require('change-case');

const normalize = require('./normalize');
const validation = require('./validation');

const richTextElementDecorator =
  require('./decorators/richTextElementDecorator');

/**
 * Creates an array of content item nodes in default culture
 *  ready to be imported to Gatsby model.
 * @param {Object} client Delivery client
 * @param {String} defaultLanguageCodename Project default language codename
 * @param {Array} contentTypeNodes Array of content type nodes
 * @param {Function} createNodeId Gatsby method for generating ID
 */
const getFromDefaultLanguage = async (
  client,
  defaultLanguageCodename,
  contentTypeNodes,
  createNodeId,
) => {
  const contentItemsResponse = await client
    .items()
    .languageParameter(defaultLanguageCodename)
    .toPromise();

  const allItems = _.unionBy(
    contentItemsResponse.items,
    // TODO not array anymore - it is an object - use probably contentItemsResponse.linkedItems.values()
    contentItemsResponse.linkedItems,
    'system.codename');

  richTextElementDecorator
    .resolveHtml(allItems);

  const itemsFlatted = parse(stringify(allItems));
  const contentItemNodes = itemsFlatted.map((contentItem) => {
    try {
      return createContentItemNode(
        createNodeId,
        contentItem,
        contentTypeNodes
      );
    } catch (error) {
      console.error(error);
    }
  });
  return contentItemNodes;
};

/**
 * Creates an array of content item nodes from other than default language
 * ready to be imported to Gatsby model.
 * @param {Object} client Kentico Cloud Dlivery client.
 * @param {Array} nonDefaultLanguageCodenames
 *  Project non default languages codenames.
 * @param {Array} contentTypeNodes Array of content type nodes.
 * @param {Function} createNodeId Gatsby method for generation ID.
 */
const getFromNonDefaultLanguage = async (
  client,
  nonDefaultLanguageCodenames,
  contentTypeNodes,
  createNodeId,
) => {
  const nonDefaultLanguageItemNodes = new Map();
  for (const languageCodename of nonDefaultLanguageCodenames) {
    const languageResponse = await client
      .items()
      .languageParameter(languageCodename)
      .getPromise();

    const allItems = _.unionBy(
      languageResponse.items,
      languageResponse.linkedItems,
      'system.codename');

    richTextElementDecorator
      .resolveHtml(allItems);

    const languageItemsFlatted = parse(stringify(allItems));
    const contentItemsNodes = languageItemsFlatted.map((languageItem) =>
      createContentItemNode(
        createNodeId,
        languageItem,
        contentTypeNodes
      )
    );
    nonDefaultLanguageItemNodes.set(languageCodename, contentItemsNodes);
  };
  return nonDefaultLanguageItemNodes;
};

/**
 * Creates a Gatsby object out of a Kentico Cloud content item object.
 * @param {function} createNodeId - Gatsby function to create a node ID.
 * @param {object} contentItem - Kentico Cloud content item object.
 * @param {array} contentTypeNodes - All Gatsby content type nodes.
 * @return {object} Gatsby content item node.
 * @throws {Error}
 */
const createContentItemNode =
  (createNodeId, contentItem, contentTypeNodes) => {
    if (!_.isFunction(createNodeId)) {
      throw new Error(`createNodeId is not a function.`);
    }
    validation.checkItemsObjectStructure([contentItem]);
    validation.checkTypesObjectStructure(contentTypeNodes);

    const codenameParamCase =
      changeCase.paramCase(contentItem.system.codename);

    const languageParamCase =
      changeCase.paramCase(contentItem.system.language);

    const nodeId = createNodeId(
      `kentico-cloud-item-${codenameParamCase}-${languageParamCase}`
    );

    const parentContentTypeNode = contentTypeNodes.find(
      (contentType) => contentType.system.codename
        === contentItem.system.type);

    const itemWithElements = normalize.parseContentItemContents(contentItem);

    const additionalData = {
      otherLanguages___NODE: [],
      contentType___NODE: parentContentTypeNode.id,
    };

    return normalize.createKcArtifactNode(
      nodeId,
      itemWithElements,
      `item`,
      contentItem.system.type,
      additionalData
    );
  };

module.exports = {
  getFromDefaultLanguage,
  getFromNonDefaultLanguage,
};
