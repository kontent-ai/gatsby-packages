const _ = require(`lodash`);

const normalize = require('../normalize');
const validation = require('../validation');

/**
 * Add Gatsby relations from rich text elements'
 * inline linked items instead of embedded ones.
 * @param {Array} defaultCultureContentItemNodes
 *   Gatsby content item nodes in default culture.
 * @param {Map<String, Array>} nonDefaultLanguageItemNodes
 *  Non-default gatsby content item nodes stored under the culture key.
 */
const decorateItemNodesWithRichTextLinkedItemsLinks = (
  defaultCultureContentItemNodes,
  nonDefaultLanguageItemNodes,
) => {
  defaultCultureContentItemNodes.forEach((itemNode) => {
    try {
      decorateItemNodeWithRichTextLinkedItemsLinks(
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
        decorateItemNodeWithRichTextLinkedItemsLinks(
          itemNode,
          languageNodes);
      } catch (error) {
        console.error(error);
      }
    });
  });
};

/**
 * Create a new property with resolved data containing Resolved Html.
 * @param {Array} items Items response from JS SDK.
 */
const resolveData = (items) => {
  items.forEach((item) => {
    Object
      .keys(item)
      .filter((key) =>
        _.has(item[key], `type`)
        && item[key].type === `rich_text`)
      .forEach((key) => {
        item[key].resolvedData = item[key].resolveData();
      });
  });
};

/**
 * Adds links to content items (stored in Rich text elements)
 *    via a sibling '_nodes' property.
 * @param {object} itemNode - Gatsby content item node.
 * @param {array} allNodesOfSameLanguage - The whole set of nodes
 *    of that same language.
 * @throws {Error}
 */
const decorateItemNodeWithRichTextLinkedItemsLinks =
  (itemNode, allNodesOfSameLanguage) => {
    validation.checkItemsObjectStructure([itemNode]);
    validation.checkItemsObjectStructure(allNodesOfSameLanguage);

    Object
      .keys(itemNode.elements)
      .forEach((propertyName) => {
        const property = itemNode.elements[propertyName];

        // ElementType.RichText from "kentico-kontent-delivery"
        if (_.get(property, `type`) === `rich_text`) {
          const linkPropertyName = `${propertyName}.linked_items___NODE`;

          const linkedNodes = allNodesOfSameLanguage
            .filter((node) => _.has(property, `linkedItemCodenames`)
              && _.isArray(property.linkedItemCodenames)
              && property.linkedItemCodenames.includes(
                node.system.codename),
            );

          _.set(itemNode.elements, linkPropertyName, []);
          normalize.addLinkedItemsLinks(
            itemNode,
            linkedNodes,
            linkPropertyName,
          );
        }
      });
  };

module.exports = {
  decorateItemNodesWithRichTextLinkedItemsLinks,
  resolveData,
};
