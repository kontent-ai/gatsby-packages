const normalize = require('./normalize');
const changeCase = require('change-case');

/**
 * Creates type nodes schema definition.
 * @param {Object} client Delivery client
 * @param {Object} schema GraphQL schema
 * @param {function} createTypes - Gatsby function to create a type
 */
const createTypeNodesSchema = async (client, schema, createTypes) => {
  const baseSchemaTypes = getKontentBaseTypeDefinitions();
  createTypes(baseSchemaTypes);

  const kontentTypesResponse = await client.types().toPromise();

  const schemaTypes =
    kontentTypesResponse.types.reduce((typeDefinitions, type) => {
      const fieldTypeDefinition = createFieldDefinitionsForType(schema, type);
      return typeDefinitions.concat(fieldTypeDefinition);
    }, []);
  createTypes(schemaTypes);
};

const createFieldDefinitionsForType = (schema, type) => {
  const elementFields = type.elements.reduce((acc, element) => {
    return Object.assign(acc, {
      [element.codename]: {
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
      elements: `${getGraphTypeName(type.system.codename)}Elements!`,
      preferred_language: 'String!',
    },
    interfaces: ['Node', 'KontentItem'],
    infer: false,
  });

  return [elementsTypeDef, typeDef];
};

const getGraphTypeName = (typeName) => {
  return normalize.getArtifactName(typeName, 'item');
};

const getElementValueType = (elementType) => {
  return `Kontent${changeCase.pascalCase(elementType)}Element`;
};

const getKontentBaseTypeDefinitions = () => {
  const typeDefs = `
    interface KontentItem @nodeInterface {
      id: ID!
      system: KontentItemSystem!
      preferred_language: String!
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
      width: Int
      height: Int
    }
    type KontentElementMultipleChoiceValue @infer {
      codename: String!
      name: String!
    }
    type KontentElementRichTextResolvedData @infer{
      html: String
      linkedItemCodenames: [String]
      componentCodenames: [String]
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
      itemCodenames: [String]
      linked_items: [KontentItem] @link(by: "id", from: "linked_items___NODE")
    }
    type KontentMultipleChoiceElement implements KontentElement @infer {
      name: String!
      type: String!
      value: [KontentElementMultipleChoiceValue]
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
      linked_items: [KontentItem] @link(by: "id", from: "linked_items___NODE")
      linkedItemCodenames: [String]
      resolvedData: KontentElementRichTextResolvedData
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
};

module.exports = {
  createTypeNodesSchema,
};
