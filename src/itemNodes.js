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
 * @param {Boolean} includeRawContent
 *  Include raw content property in artifact node
 */
const getFromDefaultLanguage = async (
  client,
  defaultLanguageCodename,
  contentTypeNodes,
  createNodeId,
  includeRawContent = false,
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
        contentTypeNodes,
        includeRawContent,
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
 * @param {Object} client Kentico Kontent Delivery client.
 * @param {Array} nonDefaultLanguageCodenames
 *  Project non default languages codenames.
 * @param {Array} contentTypeNodes Array of content type nodes.
 * @param {Function} createNodeId Gatsby method for generation ID.
 * @param {Boolean} includeRawContent
 *  Include raw content property in artifact node
 */
const getFromNonDefaultLanguage = async (
  client,
  nonDefaultLanguageCodenames,
  contentTypeNodes,
  createNodeId,
  includeRawContent = false,
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
    urlSlugElementDecorator
      .resolveUrls(allItems);

    const languageItemsFlatted = parse(stringify(allItems));
    const contentItemsNodes = languageItemsFlatted.map((languageItem) => {
      languageItem.preferred_language = languageCodename;
      return createContentItemNode(
        createNodeId,
        languageItem,
        contentTypeNodes,
        includeRawContent,
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
 * @param {Boolean} includeRawContent
 *  Include raw content property in artifact node
 * @return {object} Gatsby content item node.
 * @throws {Error}
 */
const createContentItemNode =
  (createNodeId, contentItem, contentTypeNodes, includeRawContent = false) => {
    if (!_.isFunction(createNodeId)) {
      throw new Error(`createNodeId is not a function.`);
    }
    const codenameParamCase =
      changeCase.paramCase(contentItem.system.codename);

    const languageParamCase =
      changeCase.paramCase(contentItem.preferred_language);

    const nodeId = createNodeId(
      `kentico-kontent-item-${codenameParamCase}-${languageParamCase}`,
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

    const rawContent = createItemRawContent(
      contentItem.system,
      contentItem._raw.elements,
      contentItem.preferred_language
    );

    return normalize.createKontentArtifactNode(
      nodeId,
      itemWithElements,
      `item`,
      contentItem.system.type,
      additionalData,
      includeRawContent,
      rawContent
    );
  };

/**
 * Return structured rawContent from content item for Gatsby Node
 * @param {Object} system System elements
 * @param {Object} elements Raw element property
 * @param {String} preferredLanguage Preferred language
 * @return {Object} Structured raw content object
 */
const createItemRawContent = (system, elements, preferredLanguage) => ({
  system,
  elements,
  preferred_language: preferredLanguage,
});

module.exports = {
  getFromDefaultLanguage,
  getFromNonDefaultLanguage,
  createItemRawContent,
};
