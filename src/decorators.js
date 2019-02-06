const normalize = require(`./normalize`);

/**
 * Add Gatsby relations from item nodes to it other language variants.
 * @param {Array} defaultCultureContentItemNodes
 *  Gatsby content item nodes in default culture - always contain all items
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

/**
 * Add Gatsby relations from type nodes to items based on this type.
 * @param {Array} contentItemNodes
 *  Gatsby content item nodes to make a link in
 * @param {Array} contentTypeNodes
 *  Gatsby content type nodes
 */
const decorateTypeNodesWithItemLinks = (
  contentItemNodes,
  contentTypeNodes) => {
  try {
    normalize.decorateTypeNodesWithItemLinks(
      contentItemNodes,
      contentTypeNodes
    );
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  decorateItemsWithLanguageVariants,
  decorateTypeNodesWithItemLinks,
};
