const _ = require('lodash');

const validation = require(`../validation`);

/**
 * Add Gatsby relations from type nodes to items based on this type.
 * @param {Array} contentItemNodes
 *  Gatsby content item nodes to make a link in.
 * @param {Array} contentTypeNodes
 *  Gatsby content type nodes.
 */
const decorateTypeNodesWithItemLinks = (
  contentItemNodes,
  contentTypeNodes
) => {
  try {
    validation.checkItemsObjectStructure(contentItemNodes);
    validation.checkTypesObjectStructure(contentTypeNodes);
  } catch (error) {
    console.error(error);
  }

  contentTypeNodes.forEach((contentTypeNode) => {
    const itemNodesPerType = contentItemNodes.filter((contentItemNode) =>
      contentItemNode.system.type === contentTypeNode.system.codename
    );

    if (!_.isEmpty(itemNodesPerType)) {
      const flatList =
        itemNodesPerType.map((itemNodePerType) => itemNodePerType.id);
      contentTypeNode.contentItems___NODE.push(...flatList);
    }
  });
};

module.exports = {
  decorateTypeNodesWithItemLinks,
};
