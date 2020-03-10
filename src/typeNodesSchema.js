const normalize = require('./normalize');

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
  const typeTypeDef = schema.buildObjectType({
    name: getGraphTypeTypeName(type.system.codename),
    fields: {
      system: 'KontentTypeSystem!',
      elements: '[KontentTypeElement]',
      contentItems: {
        type: `[${getGraphItemTypeName(type.system.codename)}]`,
        async resolve(source, _args, context, info) {
          const result = context.nodeModel
            .getNodesByIds({ ids: source[info.fieldName + '___NODE'] });
          return result;
        },
      },
    },
    interfaces: ['Node', 'KontentType'],
    infer: false,
  });

  const elementFields = type.elements.reduce((acc, element) => {
    return Object.assign(acc, {
      [element.codename]: {
        type: getElementValueType(element.type),
      },
    });
  }, {});

  const elementsTypeDef = schema.buildObjectType({
    name: `${getGraphItemTypeName(type.system.codename)}Elements`,
    fields: elementFields,
    infer: false,
  });

  const typeItemDef = schema.buildObjectType({
    name: getGraphItemTypeName(type.system.codename),
    fields: {
      system: 'KontentItemSystem!',
      elements: `${getGraphItemTypeName(type.system.codename)}Elements!`,
      preferred_language: 'String!',
      contentType: {
        type: `${getGraphTypeTypeName(type.system.codename)}!`,
        async resolve(source, _args, context, info) {
          const result = context.nodeModel
            .getNodeById({ id: source[info.fieldName + '___NODE'] });
          return result;
        },
      },
      usedByContentItems: {
        type: '[KontentItem]',
        async resolve(source, _args, context, info) {
          const result = context.nodeModel
            .getNodesByIds({ ids: source[info.fieldName + '___NODE'] });
          return result;
        },
      },
    },
    interfaces: ['Node', 'KontentItem'],
    infer: false,
  });
  return [elementsTypeDef, typeItemDef, typeTypeDef];
};

const getGraphItemTypeName = (typeName) => {
  return normalize.getArtifactName(typeName, 'Item');
};

const getGraphTypeTypeName = (typeName) => {
  return normalize.getArtifactName(typeName, 'Type');
};

const KontentTextElementTypeName = 'KontentTextElement';
const KontentNumberElementTypeName = 'KontentNumberElement';
const KontentMultipleChoiceElementTypeName = 'KontentMultipleChoiceElement';
const KontentDateTimeElementTypeName = 'KontentDateTimeElement';
const KontentRichTextElementTypeName = 'KontentRichTextElement';
const KontentModularContentElementTypeName = 'KontentModularContentElement';
const KontentAssetElementTypeName = 'KontentAssetElement';
const KontentCustomElementTypeName = 'KontentCustomElement';
const KontentTaxonomyElementTypeName = 'KontentTaxonomyElement';
const KontentUrlSlugElementTypeName = 'KontentUrlSlugElement';


const getElementValueType = (elementType) => {
  switch (elementType) {
  case 'text':
    return KontentTextElementTypeName;
  case 'number':
    return KontentNumberElementTypeName;
  case 'multiple_choice':
    return KontentMultipleChoiceElementTypeName;
  case 'date_time':
    return KontentDateTimeElementTypeName;
  case 'rich_text':
    return KontentRichTextElementTypeName;
  case 'asset':
    return KontentAssetElementTypeName;
  case 'custom':
    return KontentCustomElementTypeName;
  case 'modular_content':
    return KontentModularContentElementTypeName;
  case 'taxonomy':
    return KontentTaxonomyElementTypeName;
  case 'url_slug':
    return KontentUrlSlugElementTypeName;
  default:
    throw Error(`Unsupported Kontent element type: ${elementType}`);
  }
};

const getKontentBaseTypeDefinitions = () => {
  const typeDefs = `
    interface KontentType @nodeInterface {
      id: ID!
      system: KontentTypeSystem!
      elements: [KontentTypeElement]
      contentItems: [KontentItem] @link(by: "id", from: "contentItems___NODE")
    }
    type KontentTypeSystem @infer {
      codename: String!
      id: String!
      lastModified: Date! @dateformat
      name: String!
    }
    type KontentTypeElement @infer {
      codename: String!
      name: String!
      type: String!
      taxonomyGroup: String
      options: [ElementOption]
    }
    type ElementOption {
      name: String
      codename: String
    }
    interface KontentItem @nodeInterface {
      id: ID!
      system: KontentItemSystem!
      preferred_language: String!
      contentType: KontentType! @link(by: "id", from: "contentType___NODE")
      usedByContentItems: 
        [KontentItem] @link(by: "id", from: "usedByContentItems___NODE")
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
    type ${KontentAssetElementTypeName} implements KontentElement @infer {
      name: String!
      type: String!
      value: [KontentAsset]
    }
    type ${KontentDateTimeElementTypeName} implements KontentElement @infer {
      name: String!
      type: String!
      value: Date @dateformat
    }
    type ${KontentModularContentElementTypeName} implements KontentElement @infer {
      name: String!
      type: String!
      itemCodenames: [String]
      linked_items: [KontentItem] @link(by: "id", from: "linked_items___NODE")
    }
    type ${KontentMultipleChoiceElementTypeName} implements KontentElement @infer {
      name: String!
      type: String!
      value: [KontentElementMultipleChoiceValue]
    }
    type ${KontentNumberElementTypeName} implements KontentElement @infer {
      name: String!
      type: String!
      value: Float
    }
    type ${KontentRichTextElementTypeName} implements KontentElement @infer {
      name: String!
      type: String!
      value: String
      images: [KontentRichTextImage]
      links: [KontentRichTextLink]
      linked_items: [KontentItem] @link(by: "id", from: "linked_items___NODE")
      linkedItemCodenames: [String]
      resolvedData: KontentElementRichTextResolvedData
    }

    type ${KontentTaxonomyElementTypeName} implements KontentElement @infer {
      name: String!
      type: String!
      taxonomyGroup: String!
      value: [KontentTaxonomyItem]
    }
    type KontentTaxonomyItem @infer {
      name: String!
      codename: String!
    }
    type ${KontentTextElementTypeName} implements KontentElement @infer {
      name: String!
      type: String!
      value: String
    }
    type ${KontentUrlSlugElementTypeName} implements KontentElement @infer {
      name: String!
      type: String!
      value: String
    }
    type ${KontentCustomElementTypeName} implements KontentElement @infer {
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
