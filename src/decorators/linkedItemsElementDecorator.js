const _ = require('lodash');

const validation = require('../validation');
const normalize = require('../normalize');

/**
 * Add Gatsby relations from linked items elements instead of embedded ones.
 * @param {Array} defaultCultureContentItemNodes
 *   Gatsby content item nodes in default culture.
 * @param {Map<String, Array>} nonDefaultLanguageItemNodes
 *  Non-default gatsby content item nodes stored under the culture key.
 */
const decorateItemNodesWithLinkedItemsLinks = (defaultCultureContentItemNodes,
  nonDefaultLanguageItemNodes
) => {
  defaultCultureContentItemNodes.forEach((itemNode) => {
    try {
      decorateItemNodeWithLinkedItemsLinks(
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
        decorateItemNodeWithLinkedItemsLinks(itemNode, languageNodes);
      } catch (error) {
        console.error(error);
      }
    });
  });
};

/**
 * Replace links in linked items element by GraphQl references.
 * @param {object} itemNode - Gatsby content item node.
 * @param {array} allNodesOfSameLanguage - The whole set of nodes
 *    of that same language.
 * @throws {Error}
 */
const decorateItemNodeWithLinkedItemsLinks =
  (itemNode, allNodesOfSameLanguage) => {
    validation.checkItemsObjectStructure([itemNode]);
    validation.checkItemsObjectStructure(allNodesOfSameLanguage);

    Object
      .keys(itemNode.elements)
      .forEach((propertyName) => {
        const property = itemNode.elements[propertyName];

        if (_.isArray(property)) {
          // https://www.gatsbyjs.org/docs/create-source-plugin/#creating-the-relationship
          const linkPropertyName = `${propertyName}___NODE`;
          itemNode.elements[linkPropertyName] = [];

          if (_.has(property, `[0].system.codename`)) {
            const linkedNodes = allNodesOfSameLanguage
              .filter((node) => {
                const match = property.find((propertyValue) => {
                  return propertyValue !== null
                    && node !== null
                    && propertyValue.system.codename ===
                    node.system.codename
                    && propertyValue.system.type === node.system.type;
                });

                return match !== undefined && match !== null;
              });

            normalize.addLinkedItemsLinks(
              itemNode,
              linkedNodes,
              linkPropertyName,
              itemNode.elements[propertyName]
            );
          }
        }
      });
  };

module.exports = {
  decorateItemNodesWithLinkedItemsLinks,
};
