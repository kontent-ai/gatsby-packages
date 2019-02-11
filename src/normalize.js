const _ = require(`lodash`);
const crypto = require(`crypto`);
const changeCase = require(`change-case`);

// TODO - extract all logic to validate and to decorators + modules

/**
 * Adds links between a content type node and item nodes of that content type.
 * @param {array} contentItemNodes - Gatsby content item nodes.
 * @param {array} contentTypeNodes - Gatsby content type nodes.
 * @throws {Error}
 */
const decorateTypeNodesWithItemLinks =
  (contentItemNodes, contentTypeNodes) => {
    if (!contentItemNodes
      || !_.isArray(contentItemNodes)
      || (!_.isEmpty(contentItemNodes)
        && !_.has(contentItemNodes, `[0].system.type`))) {
      throw new Error(`contentItemNodes is not an array of valid objects.`);
    } else if (!contentTypeNodes
      || !_.isArray(contentTypeNodes)
      || (!_.isEmpty(contentTypeNodes)
        && !_.has(contentTypeNodes, `[0].system.codename`))) {
      throw new Error(`contentTypeNodes is not an array of valid objects.`);
    } else {
      contentTypeNodes.forEach((contentTypeNode) => {
        const itemNodesPerType = contentItemNodes.filter((contentItemNode) =>
          contentItemNode.system.type === contentTypeNode.system.codename
        );

        if (!_.isEmpty(itemNodesPerType)) {
          let flatList =
            itemNodesPerType.map((itemNodePerType) => itemNodePerType.id);
          contentTypeNode.contentItems___NODE.push(...flatList);
        }
      });
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
    if (!itemNode || !_.has(itemNode, `system.codename`)) {
      throw new Error(`itemNode is not a valid object.`);
    } else if (!allNodesOfAnotherLanguage
      || !_.isArray(allNodesOfAnotherLanguage)
      || (!_.isEmpty(allNodesOfAnotherLanguage)
        && !_.has(allNodesOfAnotherLanguage, `[0].system.codename`))) {
      throw new Error(`allNodesOfAnotherLanguage is not an array
of valid objects.`);
    } else {
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
    }
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
    if (!itemNode || !_.has(itemNode, `system.codename`)) {
      throw new Error(`itemNode is not a valid object.`);
    } else if (!allNodesOfSameLanguage
      || !_.isArray(allNodesOfSameLanguage)
      || (!_.isEmpty(allNodesOfSameLanguage)
        && !_.has(allNodesOfSameLanguage, `[0].system.codename`))) {
      throw new Error(`allNodesOfSameLanguage is not an array
of valid objects.`);
    } else {
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

              addLinkedItemsLinks(
                itemNode,
                linkedNodes,
                linkPropertyName,
                itemNode.elements[propertyName]
              );
            }
          }
        });
    }
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
    if (!itemNode || !_.has(itemNode, `system.codename`)) {
      throw new Error(`itemNode is not a valid object.`);
    } else if (!allNodesOfSameLanguage
      || !_.isArray(allNodesOfSameLanguage)
      || (!_.isEmpty(allNodesOfSameLanguage)
        && !_.has(allNodesOfSameLanguage, `[0].system.codename`))) {
      throw new Error(`allNodesOfSameLanguage is not an array
of valid objects.`);
    } else {
      Object
        .keys(itemNode.elements)
        .forEach((propertyName) => {
          const property = itemNode.elements[propertyName];

          if (_.get(property, `type`) === `rich_text`) {
            const linkPropertyName = `${propertyName}.linked_items___NODE`;

            const linkedNodes = allNodesOfSameLanguage
              .filter((node) => _.has(property, `linkedItemCodenames`)
                && _.isArray(property.linkedItemCodenames)
                && property.linkedItemCodenames.includes(
                  node.system.codename)
              );

            // TODO use element as a part of the propertyPath
            _.set(itemNode.elements, linkPropertyName, []);
            addLinkedItemsLinks(
              itemNode,
              linkedNodes,
              linkPropertyName
            );
          }
        });
    }
  };

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

    Object
      .keys(contentItem)
      .filter((key) => key !== `system` && key !== `elements`)
      .forEach((key) => {
        let propertyValue;

        if (_.has(contentItem[key], `type`)
          && contentItem[key].type === `rich_text`) {
          propertyValue = contentItem[key];
        } else if (contentItem.elements[key]
          && contentItem.elements[key].type === `modular_content`
          && !_.isEmpty(contentItem[key])) {
          let linkedItems = [];

          contentItem[key].forEach((linkedItem) => {
            linkedItems.push(
              parseContentItemContents(
                linkedItem, Array.from(processedContents), contentItem
              )
            );
          });

          propertyValue = linkedItems;
        } else {
          propertyValue = contentItem[key];
        }

        elements[key] = propertyValue;
      });

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
    let processedProperties = [];

    // Handle eventual circular references when serializing.
    const nodeContent = JSON.stringify(kcArtifact, (_key, value) => {
      if (typeof value === `object` && value !== null) {
        if (processedProperties.indexOf(value) !== -1) {
          try {
            return JSON.parse(JSON.stringify(value));
          } catch (error) {
            return null;
          }
        }

        processedProperties.push(value);
      }
      return value;
    });

    processedProperties = null;

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
  decorateTypeNodesWithItemLinks,
  decorateItemNodeWithLanguageVariantLink,
  decorateItemNodeWithLinkedItemsLinks,
  decorateItemNodeWithRichTextLinkedItemsLinks,
  parseContentItemContents,
};
