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
  nonDefaultLanguageItemNodes,
) => {
  defaultCultureContentItemNodes.forEach((itemNode) => {
    try {
      decorateItemNodeWithLinkedItemsLinks(
        itemNode,
        defaultCultureContentItemNodes,
      );
    } catch (error) {
      console.error(error);
    }
  });

  Object.values(nonDefaultLanguageItemNodes).forEach((languageNodes) => {
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
 * Replace links in linked items element by GraphQL references.
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

        if (property.type === 'modular_content') {
          // https://www.gatsbyjs.org/docs/create-source-plugin/#creating-the-relationship
          const linkPropertyPath = `[${propertyName}].linked_items___NODE`;

          const linkedNodes = allNodesOfSameLanguage
            .filter((node) => {
              const match = property.itemCodenames.find((codename) =>
                codename && codename === node.system.codename);
              return match !== undefined && match !== null;
            });

          normalize.addLinkedItemsLinks(
            itemNode,
            linkedNodes,
            linkPropertyPath,
            property.itemCodenames,
          );
        }
      });
  };

module.exports = {
  decorateItemNodesWithLinkedItemsLinks,
};
