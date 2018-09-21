const crypto = require(`crypto`)
const changeCase = require(`change-case`)

exports.createContentTypeNode = (createNodeId, contentType) => {
  const codenameParamCase = changeCase.paramCase(contentType.system.codename)
  const nodeId = createNodeId(`kentico-cloud-type-${codenameParamCase}`)

  const nodeData = {
    contentItems___NODE: []
  }

  return createKcArtifactNode(nodeId, contentType, `type`, contentType.system.codename, nodeData)
}

exports.createContentItemNode = (createNodeId, contentItem, contentTypeNodes) => {
  const codenameParamCase = changeCase.paramCase(contentItem.system.codename)
  const languageParamCase = changeCase.paramCase(contentItem.system.language)
  const nodeId = createNodeId(`kentico-cloud-item-${codenameParamCase}-${languageParamCase}`)

  const parentContentTypeNode = contentTypeNodes
    .find(contentType => contentType.system.codename === contentItem.system.type)

  const nodeData = {
    otherLanguages___NODE: [],
    contentType___NODE: parentContentTypeNode.id
  }

  return createKcArtifactNode(nodeId, contentItem, `item`, contentItem.system.type, nodeData)
}

exports.decorateTypeNodesWithItemLinks = (contentItemNodes, contentTypeNodes) => {
  contentTypeNodes.forEach(contentTypeNode => {
    const itemNodesPerType = contentItemNodes
      .filter(contentItemNode => contentItemNode.system.type === contentTypeNode.system.codename)

    if (itemNodesPerType && Array.isArray(itemNodesPerType) && itemNodesPerType.length > 0) {
      let flatList = itemNodesPerType.map(itemNodePerType => itemNodePerType.id)
      contentTypeNode.contentItems___NODE.push(...flatList)
    }
  })
}

exports.decorateItemNodeWithLanguageVariantLink = (itemNode, allNodesOfAnotherLanguage) => {
  const languageVariantNode = allNodesOfAnotherLanguage.find(nodeOfSpecificLanguage => itemNode.system.codename === nodeOfSpecificLanguage.system.codename)
  const otherLanguageLink = itemNode.otherLanguages___NODE.find(otherLanguageId => otherLanguageId === languageVariantNode.id)

  if (otherLanguageLink === undefined) {
    itemNode.otherLanguages___NODE.push(languageVariantNode.id)
  }
}

exports.refillRichTextModularCodenames = (sdkItems, debugItems) => {
  if (sdkItems && debugItems && Array.isArray(sdkItems) && Array.isArray(debugItems)) {
    sdkItems
      .forEach(sdkItem => {
        const counterpart = debugItems.find(debugItem => sdkItem.system.type === debugItem.system.type && sdkItem.system.codename === debugItem.system.codename)
        
        Object
          .keys(sdkItem)
          .forEach(propertyName => {
            const property = sdkItem[propertyName]

            if (property && property.type && property.type === `rich_text`) {
              property[`modular_content`] = counterpart.elements[propertyName].modular_content
            }
          })
      })
  }
}

exports.decorateItemNodesWithModularElementLinks = (itemNode, allNodesOfSameLanguage) => {
  Object
    .keys(itemNode)
    .forEach(propertyName => {
      const property = itemNode[propertyName]

      if (Array.isArray(property) && property.length > 0 && property[0].system !== undefined) {
        const linkPropertyName = `${propertyName}_nodes___NODE`

        const linkedNodes = allNodesOfSameLanguage
          .filter(node => {
            const match = property.find(propertyNode => propertyNode.system.type === node.system.type && propertyNode.system.codename === node.system.codename)

            return match !== undefined && match !== null
          })

          addModularItemLinks(itemNode, linkedNodes, linkPropertyName)
      }
    })
}

exports.decorateItemNodesWithRichTextModularLinks = (itemNode, allNodesOfSameLanguage) => {
  Object
    .keys(itemNode)
    .forEach(propertyName => {
      const property = itemNode[propertyName]

      if (property !== undefined && property !== null && property.type !== undefined && property.type === `rich_text` ) {
        const linkPropertyName = `${propertyName}_nodes___NODE`

        const linkedNodes = allNodesOfSameLanguage
          .filter(node => {
            const match = property.modular_content.includes(node.system.codename)

            return match !== undefined && match === true
          })

        addModularItemLinks(itemNode, linkedNodes, linkPropertyName)
      }
    })
}

createKcArtifactNode = (nodeId, kcArtifact, artifactKind, typeName = ``, additionalNodeData = null) => {
  const nodeContent = JSON.stringify(kcArtifact)

  const nodeContentDigest = crypto
    .createHash(`md5`)
    .update(nodeContent)
    .digest(`hex`)

  const codenamePascalCase = changeCase.pascalCase(typeName)
  const artifactKindPascalCase = changeCase.pascalCase(artifactKind)

  return {
    ...kcArtifact,
    ...additionalNodeData,
    id: nodeId,
    parent: null,
    children: [],
    usedByContentItems___NODE: new Array(),
    internal: {
      type: `KenticoCloud${artifactKindPascalCase}${codenamePascalCase}`,
      content: nodeContent,
      contentDigest: nodeContentDigest,
    }
  }
}

addModularItemLinks = (itemNode, linkedNodes, linkPropertyName) => {
  linkedNodes
    .forEach(linkedNode => {
      if (!linkedNode.usedByContentItems___NODE.includes(itemNode.id)) {
        linkedNode.usedByContentItems___NODE.push(itemNode.id)
      }
    })

  const idsOfLinkedNodes = linkedNodes.map(node => node.id)

  if (itemNode[linkPropertyName] === undefined) {
    itemNode[linkPropertyName] = idsOfLinkedNodes
  }
  else {
    idsOfLinkedNodes.forEach(id => {
      if (!itemNode[linkPropertyName].includes(id)) {
        itemNode[linkPropertyName].push(id)
      }
    })
  }
}