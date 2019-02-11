const _ = require(`lodash`);

const normalize = require(`../normalize`);

/**
 * Add Gatsby relations from rich text elements'
 * inline linked items instead of embedded ones.
 * @param {Array} defaultCultureContentItemNodes
 *   Gatsby content item nodes in default culture
 * @param {Map<String, Array>} nonDefaultLanguageItemNodes
 *  Non-default gatsby content item nodes stored under the culture key.
 */
const decorateItemNodesWithRichTextLinkedItemsLinks = (
  defaultCultureContentItemNodes,
  nonDefaultLanguageItemNodes
) => {
  defaultCultureContentItemNodes.forEach((itemNode) => {
    try {
      normalize.decorateItemNodeWithRichTextLinkedItemsLinks(
        itemNode,
        defaultCultureContentItemNodes
      );
    } catch (error) {
      console.error(error);
    }
  });

  nonDefaultLanguageItemNodes.forEach((languageNodes) => {
    languageNodes.forEach((itemNode) => {
      try {
        normalize.decorateItemNodeWithRichTextLinkedItemsLinks(
          itemNode,
          languageNodes);
      } catch (error) {
        console.error(error);
      }
    });
  });
};

/**
 * Create a new property with resolved Html
 *  and propagate images property.
 * @param {Array} items Items response from JS SDK
 */
const resolveHtmlAndIncludeImages = (items) => {
  items.forEach((item) => {
    Object
      .keys(item)
      .filter((key) =>
        _.has(item[key], `type`)
        && item[key].type === `rich_text`)
      .forEach((key) => {
        item.elements[key].resolvedHtml = item[key].getHtml().toString();
        item[key].images = Object.values(item.elements[key].images);
      });
  });
};

module.exports = {
  decorateItemNodesWithRichTextLinkedItemsLinks,
  resolveHtmlAndIncludeImages,
};
