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
      const contentItemId = createItemNodeId(
        contentItem.system.codename,
        contentItem.preferred_language,
        createNodeId,
      );
      const contentTypeNodeId = contentTypeNodes.find(
        (contentType) =>
          contentType.system.codename === contentItem.system.type
      ).id;
      return createContentItemNode(
        contentItemId,
        contentItem,
        contentTypeNodeId,
        includeRawContent
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
  includeRawContent = false
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

      const contentItemId = createItemNodeId(
        languageItem.system.codename,
        languageItem.preferred_language,
        createNodeId,
      );
      const contentTypeNodeId = contentTypeNodes.find(
        (contentType) =>
          contentType.system.codename === languageItem.system.type
      ).id;
      return createContentItemNode(
        contentItemId,
        languageItem,
        contentTypeNodeId,
        includeRawContent
      );
    });
    nonDefaultLanguageItemNodes[languageCodename] = contentItemsNodes;
  };
  return nonDefaultLanguageItemNodes;
};

/**
 * Creates a Gatsby object out of a Kentico Kontent content item object.
 * @param {string} nodeId - Gatsby node ID for node.
 * @param {object} contentItem - Kentico Kontent content item object.
 * @param {string} parentContentTypeNodeId - Parent Content type Gatsby node ID.
 * @param {Boolean} includeRawContent
 *  Include raw content property in artifact node
 * @return {object} Gatsby content item node.
 * @throws {Error}
 */
const createContentItemNode =
  (nodeId, contentItem, parentContentTypeNodeId, includeRawContent = false) => {
    const itemWithElements = normalize.parseContentItemContents(contentItem);
    validation.checkItemsObjectStructure([itemWithElements]);

    const additionalData = {
      otherLanguages___NODE: [],
      contentType___NODE: parentContentTypeNodeId,
    };

    // TODO create Content + Content digest from raw data
    return normalize.createKcArtifactNode(
      nodeId,
      itemWithElements,
      `item`,
      contentItem.system.type,
      additionalData,
      includeRawContent,
      contentItem
    );
  };

/**
 * Create Gatsby generated is for content item language variant.
 * @param {String} itemCodename Code of the Item for creation.
 * @param {String} itemLanguage Preffered language fo the content item.
 * @param {Function} createNodeId Gatsby API method for ID creation.
 * @return {String} Gatsby node ID fot specified Llanguage variant.
 */
const createItemNodeId = (itemCodename, itemLanguage, createNodeId) => {
  const codename = changeCase.paramCase(itemCodename);
  const language = changeCase.paramCase(itemLanguage);
  const prefix = 'kentico-kontent-item';
  const identificationString = `${prefix}-${codename}-${language}`;
  return createNodeId(identificationString);
};

module.exports = {
  getFromDefaultLanguage,
  getFromNonDefaultLanguage,
  createItemNodeId,
  createContentItemNode,
};


