const normalize = require('./normalize');

/**
 * Creates type nodes for types that do not have item representation.
 * @param {function} createTypes - Gatsby function to create a type.
 * @param {Array} contentTypeNodes - Array of content type nodes.
 */
const createTypeNodesWithoutItem = (createTypes, contentTypeNodes) => {
  const contentTypeNodesWithoutItem = contentTypeNodes.filter((typeNode) =>
    typeNode.contentItems___NODE.length === 0
  );

  let typeDefinitions = '';
  contentTypeNodesWithoutItem.map((contentTypeNodeWithoutItem) => {
    const propertyTypePairsDefinitionForContentType =
      getPropertyTypePairsDefinitionForContentType(contentTypeNodeWithoutItem);
    const typeDefinitionForContentType = getTypeDefinitionForContentType(
      contentTypeNodeWithoutItem.system.codename,
      propertyTypePairsDefinitionForContentType
    );

    typeDefinitions = typeDefinitions.concat(typeDefinitionForContentType);
  });

  createTypes(typeDefinitions);
};

const getPropertyTypePairsDefinitionForContentType =
  (contentTypeNodeWithoutItem) => {
    const propertyTypePairs = [];
    contentTypeNodeWithoutItem.elements.map((element) => {
      const elementName = element.codename;
      let elementType = '';

      switch (element.type) {
      case 'date_time':
        elementType = 'Date';
        break;
      case 'number':
        elementType = 'Float';
        break;
      default:
        elementType = 'String';
      }

      propertyTypePairs.push(`${elementName}: ${elementType} `);
    });

    return propertyTypePairs;
  };

const getTypeDefinitionForContentType = (
  contentTypeCodename,
  propertyTypePairsDefinitionForContentType
) => {
  const typeDefinition =
  // eslint-disable-next-line
  `type ${normalize.getArtifactName(contentTypeCodename, 'type')} implements Node { 
      ${propertyTypePairsDefinitionForContentType.join()}
  }`;
  return typeDefinition;
};

module.exports = {
  createTypeNodesWithoutItem,
};
