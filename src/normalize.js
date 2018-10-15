const _ = require(`lodash`);
const crypto = require(`crypto`);
const changeCase = require(`change-case`);

/**
 * Creates a Gatsby object out of a Kentico Cloud content type object.
 * @param {function} createNodeId - Gatsby function to create a node ID.
 * @param {object} contentType - Kentico Cloud content type object.
 * @return {object} Gatsby content type node.
 */
const createContentTypeNode = (createNodeId, contentType) => {
  console.info(`The 'normalize.createContentTypeNode' method starts.
contentType.system.codename: ${contentType.system.codename}`);
  const codenameParamCase = changeCase.paramCase(contentType.system.codename);
  const nodeId = createNodeId(`kentico-cloud-type-${codenameParamCase}`);

  const nodeData = {
    contentItems___NODE: [],
  };

  console.info(`The 'normalize.createContentTypeNode' method exits.`);

  return createKcArtifactNode(
      nodeId, contentType, `type`, contentType.system.codename, nodeData
  );
};

/**
 * Creates a Gatsby object out of a Kentico Cloud content item object.
 * @param {function} createNodeId - Gatsby function to create a node ID.
 * @param {object} contentItem - Kentico Cloud content item object.
 * @param {array} contentTypeNodes - All Gatsby content type nodes.
 * @return {object} Gatsby content item node.
 */
const createContentItemNode =
  (createNodeId, contentItem, contentTypeNodes) => {
    console.info(`The 'normalize.createContentItemNode' method starts.
contentItem.system.codename: ${contentItem.system.codename}`);
    const codenameParamCase = changeCase.paramCase(contentItem.system.codename);
    const languageParamCase = changeCase.paramCase(contentItem.system.language);

    const nodeId = createNodeId(
        `kentico-cloud-item-${codenameParamCase}-${languageParamCase}`
    );

    const parentContentTypeNode = contentTypeNodes.find(
        (contentType) => contentType.system.codename
            === contentItem.system.type);

    const nodeData = {
      otherLanguages___NODE: [],
      contentType___NODE: parentContentTypeNode.id,
    };

    console.info(`The 'normalize.createContentItemNode' method exits.`);
    return createKcArtifactNode(
        nodeId, contentItem, `item`, contentItem.system.type, nodeData
    );
  };

/**
 * Adds links between a content type node and item nodes of that content type.
 * @param {array} contentItemNodes - Gatsby content item nodes.
 * @param {array} contentTypeNodes - Gatsby content type nodes.
 */
const decorateTypeNodesWithItemLinks =
  (contentItemNodes, contentTypeNodes) => {
    console.info(
        `The 'normalize.decorateTypeNodesWithItemLinks' method starts.`
    );

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

    console.info(
        `The 'normalize.decorateTypeNodesWithItemLinks' method exits.`
    );
  };

/**
 * Adds links between a Gatsby content item node and its
 *    language variant nodes (translations).
 * @param {object} itemNode - Gatsby content item node.
 * @param {array} allNodesOfAnotherLanguage - The whole set of Gatsby item nodes
 *    of another language.
 */
const decorateItemNodeWithLanguageVariantLink =
  (itemNode, allNodesOfAnotherLanguage) => {
    console.info(
        `The 'normalize.decorateItemNodeWithLanguageVariantLink' method starts.
itemNode.id: ${itemNode.id}`
    );

    const languageVariantNode = allNodesOfAnotherLanguage.find(
        (nodeOfSpecificLanguage) =>
          itemNode.system.codename === nodeOfSpecificLanguage.system.codename
    );

    const otherLanguageLink =
      itemNode.otherLanguages___NODE.find(
          (otherLanguageId) => otherLanguageId === languageVariantNode.id
      );

    if (!otherLanguageLink) {
      itemNode.otherLanguages___NODE.push(languageVariantNode.id);
    }

    console.info(
        `The 'normalize.decorateItemNodeWithLanguageVariantLink' method exits.`
    );
  };

/**
 * Adds links to modular content items (stored in modular content elements)
 *    via a sibling '_nodes' property.
 * @param {object} itemNode - Gatsby content item node.
 * @param {array} allNodesOfSameLanguage - The whole set of nodes
 *    of that same language.
 */
const decorateItemNodeWithModularElementLinks =
  (itemNode, allNodesOfSameLanguage) => {
    console.info(
        `The 'normalize.decorateItemNodeWithModularElementLinks' method starts.`
    );

    Object
        .keys(itemNode.elements)
        .forEach((propertyName) => {
          const property = itemNode.elements[propertyName];

          if (_.get(property, `type`) === `modular_content`
            && _.isArray(property.value)) {
            const linkPropertyName = `${propertyName}_nodes___NODE`;
            itemNode.elements[linkPropertyName] = [];

            if (!_.isEmpty(property.value)) {
              const linkedNodes = allNodesOfSameLanguage
                  .filter((node) => {
                    const match = property.value.find((propertyValue) =>
                      propertyValue === node.system.codename
                    );

                    return match !== undefined && match !== null;
                  });

              addModularItemLinks(itemNode, linkedNodes, linkPropertyName);
            }
          }
        });

    console.info(
        `The 'normalize.decorateItemNodeWithModularElementLinks' method exits.`
    );
  };

/**
 * Adds links to modular content items (stored in rich text elements)
 *    via a sibling '_nodes' property.
 * @param {object} itemNode - Gatsby content item node.
 * @param {array} allNodesOfSameLanguage - The whole set of nodes
 *    of that same language.
 */
const decorateItemNodeWithRichTextModularLinks =
  (itemNode, allNodesOfSameLanguage) => {
    console.info(
        `The 'normalize.decorateItemNodeWithRichTextModularLinks' 
method starts.`
    );

    Object
        .keys(itemNode.elements)
        .forEach((propertyName) => {
          const property = itemNode.elements[propertyName];

          if (_.get(property, `type`) === `rich_text`
            && _.has(property, `modular_content`)
            && _.isArray(property.modular_content)) {
            const linkPropertyName = `${propertyName}_nodes___NODE`;

            const linkedNodes = allNodesOfSameLanguage
                .filter((node) =>
                  property.modular_content.includes(node.system.codename)
                );

            itemNode.elements[linkPropertyName] = [];
            addModularItemLinks(itemNode, linkedNodes, linkPropertyName);
          }
        });

    console.info(
        `The 'normalize.decorateItemNodeWithRichTextModularLinks' method exits.`
    );
  };

const createKcArtifactNode =
  (nodeId, kcArtifact, artifactKind, typeName = ``,
      additionalNodeData = null) => {
    console.info(
        `The 'normalize.createKcArtifactNode' method starts.`
    );

    const nodeContent = JSON.stringify(kcArtifact);

    const nodeContentDigest = crypto
        .createHash(`md5`)
        .update(nodeContent)
        .digest(`hex`);

    const codenamePascalCase = changeCase.pascalCase(typeName);
    const artifactKindPascalCase = changeCase.pascalCase(artifactKind);

    console.info(
        `The 'normalize.createKcArtifactNode' method exits.`
    );

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

const addModularItemLinks = (itemNode, linkedNodes, linkPropertyName) => {
  console.info(
      `The 'normalize.addModularItemLinks' method starts.
      itemNode.system.codename: ${itemNode.system.codename}, 
      linkPropertyName: ${linkPropertyName}.`
  );

  linkedNodes
      .forEach((linkedNode) => {
        if (!linkedNode.usedByContentItems___NODE.includes(itemNode.id)) {
          linkedNode.usedByContentItems___NODE.push(itemNode.id);
        }
      });

  const idsOfLinkedNodes = linkedNodes.map((node) => node.id);

  if (!itemNode.elements[linkPropertyName]) {
    itemNode.elements[linkPropertyName] = idsOfLinkedNodes;
  } else {
    idsOfLinkedNodes.forEach((id) => {
      if (!itemNode.elements[linkPropertyName].includes(id)) {
        itemNode.elements[linkPropertyName].push(id);
      }
    });
  }

  console.info(
      `The 'normalize.addModularItemLinks' method exits.`
  );
};

exports.createContentTypeNode = createContentTypeNode;
exports.createContentItemNode = createContentItemNode;
exports.decorateTypeNodesWithItemLinks = decorateTypeNodesWithItemLinks;

exports.decorateItemNodeWithLanguageVariantLink
    = decorateItemNodeWithLanguageVariantLink;

exports.decorateItemNodeWithModularElementLinks
    = decorateItemNodeWithModularElementLinks;

exports.decorateItemNodeWithRichTextModularLinks
    = decorateItemNodeWithRichTextModularLinks;
