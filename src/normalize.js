const _ = require(`lodash`);
const crypto = require(`crypto`);
const stringify = require(`json-stringify-safe`);

/**
 * Parses a content item to rebuild the 'elements' property.
 * @param {object} contentItem - The content item to be parsed.
 * @return {object} Parsed content item.
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

      delete contentItem[key].rawData;
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
* @param {String} nodeId Generated Gatsby node ID.
* @param {Object} kcArtifact Node's Kentico Kontent data.
* @param {String} artifactKind Type of the artifact ('item/type')
* @param {String} codeName Item code name
* @param {Object} additionalNodeData Additional data
* @param {Boolean} includeRawContent
*  Include raw content property in artifact node
*  @param {Object} rawContent raw content object
*  used for content property and its digest,
* @return {Object} Gatsby node object
*/
const createKontentArtifactNode =
  (nodeId, kcArtifact, artifactKind, codeName = ``,
    additionalNodeData = null, includeRawContent = false,
    rawContent) => {
    const internal = getNodeInternal(
      artifactKind,
      rawContent,
      includeRawContent,
      codeName
    );

    return {
      ...kcArtifact,
      ...additionalNodeData,
      id: nodeId,
      parent: null,
      children: [],
      usedByContentItems___NODE: [],
      internal,
    };
  };

const getNodeInternal =
  (artifactKind, rawContent, includeRawContent, codeName) => {
    const nodeContent = stringify(rawContent);
    // TODO create Content + Content digest from raw data
    const nodeContentDigest = crypto
      .createHash(`md5`)
      .update(nodeContent)
      .digest(`hex`);
    const internal = {
      type: getArtifactName(codeName, artifactKind),
      contentDigest: nodeContentDigest,
    };
    if (includeRawContent) {
      internal.content = nodeContent;
    }
    return internal;
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

/**
 * Get name of the artifact.
 * Names must match /^[_a-zA-Z][_a-zA-Z0-9]*$/.
 * @param {String} codeName Item code name
 * @param {String} artifactKind Type of the artifact ('Item/Type')
 * @return {String} Artifact name
 */
const getArtifactName = (codeName, artifactKind) => {
  return `kontent_${artifactKind}_${codeName}`;
};

module.exports = {
  createKontentArtifactNode,
  addLinkedItemsLinks,
  parseContentItemContents,
  getArtifactName,
  getNodeInternal,
};
