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
        normalize.decorateItemNodeWithRichTextLinkedItemsLinks(itemNode, languageNodes);
      } catch (error) {
        console.error(error);
      }
    });
  });
};

module.exports = {
  decorateItemNodesWithRichTextLinkedItemsLinks,
};
