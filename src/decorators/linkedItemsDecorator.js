const normalize = require(`../normalize`);

/**
 * Add Gatsby relations from linked items elements instead of embedded ones.
 * @param {Array} defaultCultureContentItemNodes
 *   Gatsby content item nodes in default culture
 * @param {Map<String, Array>} nonDefaultLanguageItemNodes
 *  Non-default gatsby content item nodes stored under the culture key.
 */
const decorateItemNodesWithLinkedItemsLinks = (
  defaultCultureContentItemNodes,
  nonDefaultLanguageItemNodes
) => {
  defaultCultureContentItemNodes.forEach((itemNode) => {
    try {
      normalize.decorateItemNodeWithLinkedItemsLinks(
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
        normalize.decorateItemNodeWithLinkedItemsLinks(itemNode, languageNodes);
      } catch (error) {
        console.error(error);
      }
    });
  });
};

module.exports = {
  decorateItemNodesWithLinkedItemsLinks,
};
