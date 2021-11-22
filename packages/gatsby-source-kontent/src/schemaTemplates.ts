const ItemsSchemaTemplate : string = 
`# All __UPPER_CASE__  wildcards will be replaced by the configuration

interface __KONTENT_ITEM_INTERFACE__ implements Node {
  id: ID!
  system: __KONTENT_ITEM_SYSTEM_TYPE__!
  # elements: type is defined programmatically
  #  - it would be possible to use union type, but there are
  #    no benefits
  #    - union type is not propagated to filter
  #    - union types are not supported for querying in Gatsby
  __KONTENT_ITEM_PREFERRED_LANGUAGE_IDENTIFIER__: String!
}

type __KONTENT_ITEM_SYSTEM_TYPE__ {
  codename: String!
  id: String!
  language: String!
  last_modified: Date! @dateformat
  name: String!
  type: String!
}

type __KONTENT_ITEM_TEXT_ELEMENT__ {
  name: String!
  type: String!
  value: String
}

type __KONTENT_ITEM_RICH_TEXT_ELEMENT__ {
  name: String!
  type: String!
  value: String
  modular_content: [__KONTENT_ITEM_INTERFACE__]
    @__KONTENT_ITEM_LANGUAGE_EXTENSION__
  images: [__KONTENT_ELEMENT_RICH_TEXT_IMAGE_VALUE__]
  links: [__KONTENT_ELEMENT_RICH_TEXT_LINK_VALUE__]
}

type __KONTENT_ITEM_NUMBER_ELEMENT__ {
  name: String!
  type: String!
  value: Float
}

type __KONTENT_ITEM_MULTIPLE_CHOICE_ELEMENT__ {
  name: String!
  type: String!
  value: [__KONTENT_ELEMENT_MULTIPLE_CHOICE_VALUE__]
}

type __KONTENT_ITEM_DATE_TIME_ELEMENT__ {
  name: String!
  type: String!
  value: Date @dateformat
}

type __KONTENT_ITEM_ASSET_ELEMENT__ {
  name: String!
  type: String!
  value: [__KONTENT_ELEMENT_ASSET_VALUE__]
}

type __KONTENT_ITEM_MODULAR_CONTENT_ELEMENT__ {
  name: String!
  type: String!
  value: [__KONTENT_ITEM_INTERFACE__] @__KONTENT_ITEM_LANGUAGE_EXTENSION__
}

type __KONTENT_ITEM_CUSTOM_ELEMENT_ELEMENT__ {
  name: String!
  type: String!
  value: String
}

type __KONTENT_ITEM_TAXONOMY_ELEMENT__ {
  name: String!
  type: String!
  taxonomy_group: String!
  value: [__KONTENT_ELEMENT_TAXONOMY_VALUE__]
}

type __KONTENT_ITEM_URL_SLUG_ELEMENT__ {
  name: String!
  type: String!
  value: String
}

type __KONTENT_ELEMENT_MULTIPLE_CHOICE_VALUE__ {
  codename: String!
  name: String!
}

type __KONTENT_ELEMENT_ASSET_VALUE__ {
  name: String!
  description: String
  type: String!
  size: Int!
  url: String!
  width: Int
  height: Int
}

type __KONTENT_ELEMENT_TAXONOMY_VALUE__ {
  name: String!
  codename: String!
}

type __KONTENT_ELEMENT_RICH_TEXT_IMAGE_VALUE__ {
  image_id: String!
  url: String!
  description: String
  height: Int
  width: Int
}

type __KONTENT_ELEMENT_RICH_TEXT_LINK_VALUE__ {
  link_id: String!
  codename: String!
  type: String!
  url_slug: String!
}
`;

const TaxonomiesSchemaTemplate : string = 
`# All __UPPER_CASE__  wildcards will be replaced by the configuration

type __KONTENT_TAXONOMY_NAME__ implements Node {
  id: ID!
  system: __KONTENT_TAXONOMY_SYSTEM_TYPE__!
  terms: [__KONTENT_TAXONOMY_TERM_TYPE__]
}

type __KONTENT_TAXONOMY_SYSTEM_TYPE__ {
  codename: String!
  id: String!
  last_modified: Date! @dateformat
  name: String!
}

type __KONTENT_TAXONOMY_TERM_TYPE__ {
  codename: String
  name: String
  terms: [__KONTENT_TAXONOMY_TERM_TYPE__]
}
`;

const TypesSchemaTemplate : string =
`# All __UPPER_CASE__  wildcards will be replaced by the configuration

type __KONTENT_TYPE_NAME__ implements Node {
  id: ID!
  system: __KONTENT_TYPE_SYSTEM_TYPE__!
  elements: [__KONTENT_TYPE_ELEMENT_TYPE__]
}

type __KONTENT_TYPE_SYSTEM_TYPE__ {
  codename: String!
  id: String!
  last_modified: Date! @dateformat
  name: String!
}

type __KONTENT_TYPE_ELEMENT_TYPE__ {
  codename: String
  name: String
  type: String
  taxonomy_group: String
  options: [__KONTENT_TYPE_ELEMENT_OPTIONS_TYPE__]
}

type __KONTENT_TYPE_ELEMENT_OPTIONS_TYPE__ {
  name: String
  codename: String
}
`;

export {
  ItemsSchemaTemplate,
  TaxonomiesSchemaTemplate,
  TypesSchemaTemplate
}