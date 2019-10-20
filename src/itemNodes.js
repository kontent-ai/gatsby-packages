const { parse, stringify } = require(`flatted/cjs`);
const _ = require('lodash');
const changeCase = require('change-case');

const normalize = require('./normalize');
const validation = require('./validation');

const richTextElementDecorator =
  require('./decorators/richTextElementDecorator');
const urlSlugElementDecorator =
  require('./decorators/urlSlugElementDecorator');

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
    Object.values(contentItemsResponse.linkedItems),
    'system.codename');

  richTextElementDecorator
    .resolveData(allItems);
  urlSlugElementDecorator
    .resolveUrls(allItems);

  const itemsFlatted = parse(stringify(allItems));
  const contentItemNodes = itemsFlatted.map((contentItem) => {
    try {
      contentItem.preferred_language = defaultLanguageCodename;
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
 * @param {Object} client Kentico Kontent Dlivery client.
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
  const nonDefaultLanguageItemNodes = {};
  for (const languageCodename of nonDefaultLanguageCodenames) {
    const languageResponse = await client
      .items()
      .languageParameter(languageCodename)
      .toPromise();

    const allItems = _.unionBy(
      languageResponse.items,
      Object.values(languageResponse.linkedItems),
      'system.codename');

    richTextElementDecorator
      .resolveData(allItems);

    const languageItemsFlatted = parse(stringify(allItems));
    const contentItemsNodes = languageItemsFlatted.map((languageItem) => {
      languageItem.preferred_language = languageCodename;
      return createContentItemNode(
        createNodeId,
        languageItem,
        contentTypeNodes
      );
    });
    nonDefaultLanguageItemNodes[languageCodename] = contentItemsNodes;
  };
  return nonDefaultLanguageItemNodes;
};

/**
 * Creates a Gatsby object out of a Kentico Kontent content item object.
 * @param {function} createNodeId - Gatsby function to create a node ID.
 * @param {object} contentItem - Kentico Kontent content item object.
 * @param {array} contentTypeNodes - All Gatsby content type nodes.
 * @return {object} Gatsby content item node.
 * @throws {Error}
 */
const createContentItemNode =
  (createNodeId, contentItem, contentTypeNodes) => {
    if (!_.isFunction(createNodeId)) {
      throw new Error(`createNodeId is not a function.`);
    }
    const codenameParamCase =
      changeCase.paramCase(contentItem.system.codename);

    const languageParamCase =
      changeCase.paramCase(contentItem.preferred_language);

    const nodeId = createNodeId(
      `kentico-kontent-item-${codenameParamCase}-${languageParamCase}`
    );

    const parentContentTypeNode = contentTypeNodes.find(
      (contentType) => contentType.system.codename
        === contentItem.system.type);

    const itemWithElements = normalize.parseContentItemContents(contentItem);
    validation.checkItemsObjectStructure([itemWithElements]);
    validation.checkTypesObjectStructure(contentTypeNodes);

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
