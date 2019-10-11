const _ = require(`lodash`);
const crypto = require(`crypto`);
const changeCase = require(`change-case`);
const stringify = require(`json-stringify-safe`);

/**
 * Parses a content item to rebuild the 'elements' property.
 * @param {object} contentItem - The content item to be parsed.
 * @param {array} processedContents - The array with the recursion
 * traversal history.
 * @return {object} Parsed content item.
 * @throws {Error}
 */
const parseContentItemContents =
  (contentItem) => {
    const elements = {};

    const elementPropertyKeys = Object.keys(contentItem._raw.elements);

    for (const key of elementPropertyKeys) {
      const elementType = _.get(contentItem, `_raw.elements[${key}].type`);
      if (elementType === 'modular_content') {
        delete contentItem[key].value;
      }

      const propertyValue = contentItem[key];
      elements[key] = propertyValue;
    }

    const itemWithElements = {
      system: contentItem.system,
      elements: elements,
      preferred_language: contentItem.preferred_language,
    };

    return itemWithElements;
  };

/**
 * Create Gatsby Node structure.
 * @param {Number} nodeId Gebnerated Gatsby node ID.
 * @param {Object} kcArtifact Node's Kentico Kontent data.
 * @param {String} artifactKind Type of the artifact ('item/type')
 * @param {String} codeName Item code name
 * @param {Object} additionalNodeData Additional data
 * @return {Object} Gatsby node object
 */
const createKcArtifactNode =
  (nodeId, kcArtifact, artifactKind, codeName = ``,
    additionalNodeData = null) => {
    const nodeContent = stringify(kcArtifact);

    const nodeContentDigest = crypto
      .createHash(`md5`)
      .update(nodeContent)
      .digest(`hex`);

    const codenamePascalCase = changeCase.pascalCase(codeName);
    const artifactKindPascalCase = changeCase.pascalCase(artifactKind);

    return {
      ...kcArtifact,
      ...additionalNodeData,
      id: nodeId,
      parent: null,
      children: [],
      usedByContentItems___NODE: [],
      internal: {
        type: `KenticoCloud${artifactKindPascalCase}${codenamePascalCase}`,
        content: nodeContent,
        contentDigest: nodeContentDigest,
      },
    };
  };

const addLinkedItemsLinks =
  (itemNode, linkedNodes, linkPropertyName, sortPattern = []) => {
    linkedNodes
      .forEach((linkedNode) => {
        if (!linkedNode.usedByContentItems___NODE.includes(itemNode.id)) {
          linkedNode.usedByContentItems___NODE.push(itemNode.id);
        }
      });

    // important to have the same order as it is Kentico Kontent
    const sortedLinkedNodes = linkedNodes
      .sort((a, b) => {
        const first = sortPattern.indexOf(a.system.codename);
        const second = sortPattern.indexOf(b.system.codename);
        return first - second;
      })
      .map((item) => item.id);

    _.set(itemNode.elements, linkPropertyName, sortedLinkedNodes);
  };

module.exports = {
  createKcArtifactNode,
  addLinkedItemsLinks,
  parseContentItemContents,
};
