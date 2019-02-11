const _ = require('lodash');

const validation = require('../validation');

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
        decorateItemNodeWithLanguageVariantLink(
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
            decorateItemNodeWithLanguageVariantLink(
              contentItemNode,
              otherLanguageNodes);

            decorateItemNodeWithLanguageVariantLink(
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
 * Adds links between a Gatsby content item node and its
 *    language variant nodes (translations).
 * @param {object} itemNode - Gatsby content item node.
 * @param {array} allNodesOfAnotherLanguage - The whole set of Gatsby item nodes
 *    of another language.
 * @throws {Error}
 */
const decorateItemNodeWithLanguageVariantLink =
  (itemNode, allNodesOfAnotherLanguage) => {
    validation.checkItemsObjectStructure([itemNode]);
    validation.checkItemsObjectStructure(allNodesOfAnotherLanguage);

    const languageVariantNode = allNodesOfAnotherLanguage.find(
      (nodeOfSpecificLanguage) =>
        itemNode.system.codename === nodeOfSpecificLanguage.system.codename
        && itemNode.system.type === nodeOfSpecificLanguage.system.type
        && itemNode.system.language !== nodeOfSpecificLanguage.system.language
    );

    const otherLanguageLink = languageVariantNode &&
      itemNode.otherLanguages___NODE.find(
        (otherLanguageId) => otherLanguageId === languageVariantNode.id
      );

    if (!otherLanguageLink && _.get(languageVariantNode, 'id')) {
      itemNode.otherLanguages___NODE.push(languageVariantNode.id);
    }
  };

module.exports = {
  decorateItemsWithLanguageVariants,
};
