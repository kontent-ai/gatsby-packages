const _ = require(`lodash`);
const crypto = require(`crypto`);
const changeCase = require(`change-case`);

/**
 * Parses a content item to rebuild the 'elements' property.
 * @param {object} contentItem - The content item to be parsed.
 * @param {array} processedContents - The array with the recursion
 * traversal history.
 * @return {object} Parsed content item.
 * @throws {Error}
 */
const parseContentItemContents =
  (contentItem, processedContents = []) => {
    if (processedContents.includes(contentItem.system.codename)) {
      processedContents.push(contentItem.system.codename);
      const flatted = processedContents.join(` -> `);

      console.error(`Cycle detected in linked items' path: ${flatted}`);
      return {
        system: contentItem.system,
        elements: null,
        cycleDetected: true,
      };
    }

    processedContents.push(contentItem.system.codename);
    const elements = {};

    // TODO Needs to be changed - elements are in _debug.rawElements
    // Use _debug.rawElements.Keys for iterating instead of elementPropertyKeys
    const elementPropertyKeys = Object
      .keys(contentItem)
      .filter((key) => key !== `system` && key !== `elements`);

    for (const key of elementPropertyKeys) {
      let propertyValue;

      // could be used (ElementType.ModularContent) from "kentico-cloud-delivery"
      // if (_.get(contentItem, `_debug.rawElements.elements[${key}].type`) === 'modular_content')
      if (_.get(contentItem, `elements[${key}].type`) === 'modular_content') {
        const linkedItems = [];
        // TODO is in Value contentItem[key].value.forEach((linkedItem) => {
        contentItem[key].forEach((linkedItem) => {
          linkedItems.push(
            parseContentItemContents(
              linkedItem, Array.from(processedContents), contentItem
            )
          );
        });
        propertyValue = linkedItems;
      } else {
        // Every element has now a value use contentItem[key].value
        propertyValue = contentItem[key];
      }

      elements[key] = propertyValue;
    }

    const itemWithElements = {
      system: contentItem.system,
      elements: elements,
    };

    return itemWithElements;
  };

/**
 * Create Gatsby Node structure.
 * @param {Number} nodeId Gebnerated Gatsby node ID.
 * @param {Object} kcArtifact Node's Kentico Cloud data.
 * @param {String} artifactKind Type of the artifact ('item/type')
 * @param {String} codeName Item code name
 * @param {Object} additionalNodeData Additional data
 * @return {Object} Gatsby node object
 */
const createKcArtifactNode =
  (nodeId, kcArtifact, artifactKind, codeName = ``,
    additionalNodeData = null) => {
    const nodeContent = JSON.stringify(kcArtifact);

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
  (itemNode, linkedNodes, linkPropertyName, originalNodeCollection = []) => {
    linkedNodes
      .forEach((linkedNode) => {
        if (!linkedNode.usedByContentItems___NODE.includes(itemNode.id)) {
          linkedNode.usedByContentItems___NODE.push(itemNode.id);
        }
      });

    // important to have the same order as it is Kentico Cloud
    const sortPattern = originalNodeCollection
      .map((item) => item.system.id);

    const sortedLinkedNodes = linkedNodes
      .sort((a, b) =>
        sortPattern.indexOf(a.system.id) - sortPattern.indexOf(b.system.id)
      )
      .map((item) => item.id);

    _.set(itemNode.elements, linkPropertyName, sortedLinkedNodes);
  };

module.exports = {
  createKcArtifactNode,
  addLinkedItemsLinks,
  parseContentItemContents,
};
