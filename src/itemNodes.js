const { parse, stringify } = require(`flatted/cjs`);
const _ = require(`lodash`);

const normalize = require(`./normalize`);

/**
 * Creates an array of content item nodes in default culture
 *  ready to be imported to Gatsby model.
 * @param {Object} client Delivery client
 * @param {String} defaultLanguageCodename Project default language codename
 * @param {Function} createNodeId Gatsby method for generating ID
 * @param {Array} contentTypeNodes Array of content type nodes
 */
const getFromDefaultLanguage = async (
  client,
  defaultLanguageCodename,
  createNodeId,
  contentTypeNodes
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
 * @param {Array} nonDefaultLanguageCodenames
 *  Project non default languages codenames.
 * @param {Object} client Kentico Cloud Dlivery client.
 * @param {Array} defaultCultureContentItemNodes
 *  Array of content item nodes in default language.
 * @param {Function} createNodeId Gatsby method for generation ID.
 * @param {Array} contentTypeNodes Array of content type nodes.
 */
const getFromNonDefaultLanguage = async (
  nonDefaultLanguageCodenames,
  client,
  defaultCultureContentItemNodes,
  createNodeId,
  contentTypeNodes
) => {
  const nonDefaultLanguagePromises = nonDefaultLanguageCodenames
    .map((languageCodename) => client
      .items()
      .languageParameter(languageCodename)
      .getPromise());
  const languageResponses = await Promise.all(nonDefaultLanguagePromises);
  const nonDefaultLanguageItemNodes = new Map();
  languageResponses.forEach((languageResponse) => {
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
    let allNodesOfCurrentLanguage = [];
    let languageCodename;
    defaultCultureContentItemNodes.forEach((contentItemNode) => {
      const languageVariantItem = languageItemsFlatted.find((variant) => {
        return contentItemNode.system.codename === variant.system.codename
          && contentItemNode.system.type === variant.system.type;
      });
      if (languageVariantItem
        && _.has(languageVariantItem, `system.language`)
        && _.isString(languageVariantItem.system.language)) {
        languageCodename = languageVariantItem.system.language;
        let languageVariantNode;
        try {
          languageVariantNode =
            normalize.createContentItemNode(
              createNodeId,
              languageVariantItem,
              contentTypeNodes
            );
        } catch (error) {
          console.error(error);
        }
        if (languageVariantNode) {
          try {
            normalize.decorateItemNodeWithLanguageVariantLink(
              languageVariantNode,
              defaultCultureContentItemNodes
            );
          } catch (error) {
            console.error(error);
          }
          allNodesOfCurrentLanguage.push(languageVariantNode);
        }
      }
    });
    if (languageCodename && _.isString(languageCodename)) {
      nonDefaultLanguageItemNodes
        .set(languageCodename, allNodesOfCurrentLanguage);
    }
  });
  return nonDefaultLanguageItemNodes;
};

module.exports = {
  getFromDefaultLanguage,
  getFromNonDefaultLanguage,
};
