const normalize = require('./normalize');
const changeCase = require('change-case');

/**
 * Creates type nodes schema definition.
 * @param {Object} client Delivery client
 * @param {Object} schema GraphQL schema
 * @param {function} createTypes - Gatsby function to create a type.
 */
const createTypeNodesSchema = async (client, schema, createTypes) => {
  createTypes(getKontentBaseTypeDefintions());

  const kontentTypesResponse = await client.types().toPromise();

  createTypes(
    kontentTypesResponse.types.reduce(
      (typeDefinitions, type) => typeDefinitions.concat(createFieldDefinitionsForType(schema, type)),
      [],
    ),
  );
};

/**
 * Creates type field definition.
 * @param {Object} schema GraphQL schema
 * @param {Object} type - Konten type.
 */
const createFieldDefinitionsForType = (schema, type) => {
  const elementFields = type.elements.reduce((acc, element) => {
    const fieldName = getGraphFieldName(element.codename);

    return Object.assign(acc, {
      [fieldName]: {
        type: getElementValueType(element.type),
      },
    });
  }, {});

  const elementsTypeDef = schema.buildObjectType({
    name: `${getGraphTypeName(type.system.codename)}Elements`,
    fields: elementFields,
    infer: false,
  });

  const typeDef = schema.buildObjectType({
    name: getGraphTypeName(type.system.codename),
    fields: {
      system: 'KontentItemSystem!',
      elements: `${getGraphTypeName(type.system.codename)}Elements`,
    },
    interfaces: ['Node', 'KontentItem'],
    infer: false,
  });

  return [elementsTypeDef, typeDef];
}

/**
 * Returns graph type name.
 * @param {String} typeName
 */
const getGraphTypeName = (typeName) => {
  return normalize.getArtifactName(typeName, 'item');
}

/**
 * Returns element value type.
 * @param {String} elementType
 */
const getElementValueType = (elementType) => {
  return `Kontent${changeCase.pascalCase(elementType)}Element`;
}

/**
 * Returns element field name.
 * @param {String} elementName
 */
const getGraphFieldName = (elementName) => {
  return changeCase.camelCase(elementName);
}

/**
 * Returns Kontent base type definitions.
 * @param {String} elementName
 */
const getKontentBaseTypeDefintions = () => {
  const typeDefs = `
    interface KontentItem @nodeInterface {
      id: ID!
      system: KontentItemSystem!
    }
    interface KontentElement @dontInfer {
      name: String!
      type: String!
    }
    type KontentItemSystem @infer {
      codename: String!
      id: String!
      language: String!
      lastModified: Date! @dateformat
      name: String!
      type: String!
    }
    type KontentAsset @infer {
      name: String!
      description: String
      type: String!
      size: Int!
      url: String!
      width: Int!
      height: Int!
    }
    type KontentAssetElement implements KontentElement @infer {
      name: String!
      type: String!
      value: [KontentAsset]
    }
    type KontentDateTimeElement implements KontentElement @infer {
      name: String!
      type: String!
      value: Date @dateformat
    }
    type KontentModularContentElement implements KontentElement @infer {
      name: String!
      type: String!
      value: [KontentItem] @link(by: "system.codename")
    }
    type KontentMultipleChoiceElement implements KontentElement @infer {
      name: String!
      type: String!
    }
    type KontentNumberElement implements KontentElement @infer {
      name: String!
      type: String!
      value: Float
    }
    type KontentRichTextElement implements KontentElement @infer {
      name: String!
      type: String!
      value: String
      images: [KontentRichTextImage]
      links: [KontentRichTextLink]
      linkedItems: [KontentItem] @link(by: "system.codename")
    }
    type KontentRichTextImage @infer {
      description: String
      height: Int!
      imageId: String!
      url: String!
      width: Int!
    }
    type KontentRichTextLink @infer {
      codename: String!
      linkId: String!
      type: String!
      urlSlug: String!
    }
    type KontentTaxonomyElement implements KontentElement @infer {
      name: String!
      type: String!
      taxonomyGroup: String!
      value: [KontentTaxonomyItem]
    }
    type KontentTaxonomyItem @infer {
      name: String!
      codename: String!
    }
    type KontentTextElement implements KontentElement @infer {
      name: String!
      type: String!
      value: String
    }
    type KontentUrlSlugElement implements KontentElement @infer {
      name: String!
      type: String!
      value: String
    }
    type KontentCustomElement implements KontentElement @infer {
      name: String!
      type: String!
      value: String
    }
  `;

  return typeDefs;
}

module.exports = {
  createTypeNodesSchema,
};