const { parse, stringify } = require(`flatted/cjs`);
const _ = require(`lodash`);

const normalize = require(`./normalize`);

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
    .getPromise();

  // TODO extract to method
  contentItemsResponse.items.forEach((item) => {
    Object
      .keys(item)
      .filter((key) =>
        _.has(item[key], `type`) && item[key].type === `rich_text`)
      .forEach((key) => {
        item.elements[key].resolvedHtml = item[key].getHtml().toString();
        item[key].images = Object.values(item.elements[key].images);
      });
  });
  const itemsFlatted = parse(stringify(contentItemsResponse.items));
  const contentItemNodes = itemsFlatted.map((contentItem) => {
    try {
      return normalize
        .createContentItemNode(createNodeId, contentItem, contentTypeNodes);
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

    // TODO extract to method
    languageResponse.items.forEach((item) => {
      Object
        .keys(item)
        .filter((key) =>
          _.has(item[key], `type`) && item[key].type === `rich_text`)
        .forEach((key) => {
          item.elements[key].resolvedHtml = item[key].getHtml().toString();
          item[key].images = Object.values(item.elements[key].images);
        });
    });

    const languageItemsFlatted = parse(stringify(languageResponse.items));
    const contentItemsNodes = languageItemsFlatted.map((languageItem) =>
      normalize.createContentItemNode(
        createNodeId,
        languageItem,
        contentTypeNodes
      )
    );
    nonDefaultLanguageItemNodes.set(languageCodename, contentItemsNodes);
  };
  return nonDefaultLanguageItemNodes;
};

module.exports = {
  getFromDefaultLanguage,
  getFromNonDefaultLanguage,
};
