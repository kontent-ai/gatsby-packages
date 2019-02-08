const normalize = require(`../normalize`);

/**
 * Add Gatsby relations from item nodes to it other language variants.
 * @param {Array} defaultCultureContentItemNodes
 *  Gatsby content item nodes in default culture
 * @param {Map<String, Array>} nonDefaultLanguageItemNodes
 *  Non-default gatsby content item nodes stored under the culture key.
 */
const decorateItemsWithLanguageVariants = (
  defaultCultureContentItemNodes,
  nonDefaultLanguageItemNodes
) => {
  for (const [languageCodename, currentLanguageNodes]
    of nonDefaultLanguageItemNodes) {
    defaultCultureContentItemNodes.forEach((contentItemNode) => {
      try {
        normalize.decorateItemNodeWithLanguageVariantLink(
          contentItemNode,
          currentLanguageNodes);
      } catch (error) {
        console.error(error);
      }
    });

    for (let [otherLanguageCodename, otherLanguageNodes]
      of nonDefaultLanguageItemNodes) {
      if (otherLanguageCodename !== languageCodename) {
        currentLanguageNodes.forEach((contentItemNode) => {
          try {
            normalize.decorateItemNodeWithLanguageVariantLink(
              contentItemNode,
              otherLanguageNodes);

            normalize.decorateItemNodeWithLanguageVariantLink(
              contentItemNode,
              defaultCultureContentItemNodes);
          } catch (error) {
            console.error(error);
          }
        });
      }
    }
  }
};

module.exports = {
  decorateItemsWithLanguageVariants,
};
