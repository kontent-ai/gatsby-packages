const _ = require('lodash');

const validation = require('../validation');

/**
 * Add Gatsby relations from item nodes to its other language variants.
 * @param {Array} defaultCultureContentItemNodes
 *  Gatsby content item nodes in default culture.
 * @param {Map<String, Array>} nonDefaultLanguageItemNodes
 *  Non-default gatsby content item nodes stored under the culture key.
 */
const decorateItemsWithLanguageVariants = (
  defaultCultureContentItemNodes,
  nonDefaultLanguageItemNodes
) => {
  for (const [languageCodename, currentLanguageNodes]
    of Object.entries(nonDefaultLanguageItemNodes)) {
    defaultCultureContentItemNodes.forEach((contentItemNode) => {
      try {
        decorateItemNodeWithLanguageVariantLink(
          contentItemNode,
          currentLanguageNodes);
      } catch (error) {
        console.error(error);
      }
    });

    for (const [otherLanguageCodename, otherLanguageNodes]
      of Object.entries(nonDefaultLanguageItemNodes)) {
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
    );
    if (languageVariantNode) {
      makeLink(languageVariantNode, itemNode);
      makeLink(itemNode, languageVariantNode);
    }
  };

const makeLink = (firstItem, secondItem) => {
  const existingLink = firstItem &&
    secondItem &&
    secondItem.otherLanguages___NODE &&
    secondItem.otherLanguages___NODE.find(
      (otherLanguageId) => otherLanguageId === firstItem.id
    );

  if (!existingLink && _.get(firstItem, 'id')) {
    if (!secondItem.otherLanguages___NODE) {
      secondItem.otherLanguages___NODE = [];
    };
    secondItem.otherLanguages___NODE.push(firstItem.id);
  }
};

module.exports = {
  decorateItemsWithLanguageVariants,
};

