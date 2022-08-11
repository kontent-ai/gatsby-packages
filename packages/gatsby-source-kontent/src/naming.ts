import { PluginNamingConfiguration } from './types';
import { ItemsSchemaTemplate, TaxonomiesSchemaTemplate, TypesSchemaTemplate } from "./schemaTemplates";

const CONNECTOR = '_';
const SYSTEM_IDENTIFIER = 'system';
const ELEMENT_IDENTIFIER = 'element';
const VALUE_IDENTIFIER = 'value';
const TAXONOMY_TERM_IDENTIFIER = 'term';
const ELEMENT_OPTION_IDENTIFIER = 'option';
const MULTI_ELEMENT_IDENTIFIER = `${ELEMENT_IDENTIFIER}s`;
const LANGUAGE_LINK_EXTENSION_IDENTIFIER = 'language_link';
const ITEM_IDENTIFIER = 'item';
const TAXONOMY_IDENTIFIER = 'taxonomy';
const TYPE_IDENTIFIER = 'type';
const CACHE_IDENTIFIER = 'cache';

const RICH_TEXT_ELEMENT_TYPE_NAME = 'rich_text';

const PREFERRED_LANGUAGE_IDENTIFIER = 'preferred_language';

const defaultPluginNamingConfiguration: PluginNamingConfiguration = {
  prefix: `kontent`,
};

/**
 * Retrieve ID string for Gatsby's CreateNodeId method for specified item language variant.
 * @param id  Item `system.id` because codename is changeable.
 * @param preferredLanguage Preferred language of the language variant.
 * @param config Optional parameter with extra configuration.
 */
const getKontentItemNodeStringForId = (
  id: string,
  preferredLanguage: string,
  config: PluginNamingConfiguration = defaultPluginNamingConfiguration,
): string =>
  `${config.prefix}${CONNECTOR}${ITEM_IDENTIFIER}${CONNECTOR}${preferredLanguage}${CONNECTOR}${id}`;

const getKontentItemNodeTypeName = (
  type: string,
  config: PluginNamingConfiguration = defaultPluginNamingConfiguration,
): string =>
  `${config.prefix}${CONNECTOR}${ITEM_IDENTIFIER}${CONNECTOR}${type}`;

const getKontentItemInterfaceName = (
  config: PluginNamingConfiguration = defaultPluginNamingConfiguration,
): string => `${config.prefix}${CONNECTOR}${ITEM_IDENTIFIER}`;

const getKontentItemSystemElementTypeName = (
  config: PluginNamingConfiguration = defaultPluginNamingConfiguration,
): string =>
  `${config.prefix}${CONNECTOR}${ITEM_IDENTIFIER}${CONNECTOR}${SYSTEM_IDENTIFIER}`;

const getKontentItemElementTypeNameByType = (
  type: string,
  config: PluginNamingConfiguration = defaultPluginNamingConfiguration,
): string =>
  `${config.prefix}${CONNECTOR}${ITEM_IDENTIFIER}${CONNECTOR}${type}${CONNECTOR}${ELEMENT_IDENTIFIER}${CONNECTOR}${VALUE_IDENTIFIER}`;

const getKontentItemElementValueTypeNameByType = (
  type: string,
  config: PluginNamingConfiguration = defaultPluginNamingConfiguration,
): string =>
  `${config.prefix}${CONNECTOR}${ITEM_IDENTIFIER}${CONNECTOR}${type}${CONNECTOR}${ELEMENT_IDENTIFIER}`;

const getKontentItemElementsSchemaTypeName = (
  type: string,
  config: PluginNamingConfiguration = defaultPluginNamingConfiguration,
): string =>
  `${config.prefix}${CONNECTOR}${ITEM_IDENTIFIER}${CONNECTOR}${type}${CONNECTOR}${MULTI_ELEMENT_IDENTIFIER}`;

const getKontentItemLanguageLinkExtensionName = (
  config: PluginNamingConfiguration = defaultPluginNamingConfiguration,
): string =>
  `${config.prefix}${CONNECTOR}${ITEM_IDENTIFIER}${CONNECTOR}${LANGUAGE_LINK_EXTENSION_IDENTIFIER}`;

const getKontentTaxonomyNodeStringForCodeName = (
  codename: string,
  config: PluginNamingConfiguration = defaultPluginNamingConfiguration,
): string =>
  `${config.prefix}${CONNECTOR}${TAXONOMY_IDENTIFIER}${CONNECTOR}${codename}`;

const getKontentTaxonomyTypeName = (
  config: PluginNamingConfiguration = defaultPluginNamingConfiguration,
): string => `${config.prefix}${CONNECTOR}${TAXONOMY_IDENTIFIER}`;

const getKontentTaxonomySystemElementTypeName = (
  config: PluginNamingConfiguration = defaultPluginNamingConfiguration,
): string =>
  `${config.prefix}${CONNECTOR}${TAXONOMY_IDENTIFIER}${CONNECTOR}${SYSTEM_IDENTIFIER}`;

const getKontentTaxonomyTermTypeName = (
  config: PluginNamingConfiguration = defaultPluginNamingConfiguration,
): string =>
  `${config.prefix}${CONNECTOR}${TAXONOMY_IDENTIFIER}${CONNECTOR}${TAXONOMY_TERM_IDENTIFIER}`;

const getKontentTypeNodeStringForCodeName = (
  codename: string,
  config: PluginNamingConfiguration = defaultPluginNamingConfiguration,
): string =>
  `${config.prefix}${CONNECTOR}${TYPE_IDENTIFIER}${CONNECTOR}${codename}`;

const getKontentTypeTypeName = (
  config: PluginNamingConfiguration = defaultPluginNamingConfiguration,
): string => `${config.prefix}${CONNECTOR}${TYPE_IDENTIFIER}`;

const getKontentTypeSystemElementTypeName = (
  config: PluginNamingConfiguration = defaultPluginNamingConfiguration,
): string =>
  `${config.prefix}${CONNECTOR}${TYPE_IDENTIFIER}${CONNECTOR}${SYSTEM_IDENTIFIER}`;

const getKontentTypeElementTypeName = (
  config: PluginNamingConfiguration = defaultPluginNamingConfiguration,
): string =>
  `${config.prefix}${CONNECTOR}${TYPE_IDENTIFIER}${CONNECTOR}${ELEMENT_IDENTIFIER}`;

const getKontentTypeElementOptionTypeName = (
  config: PluginNamingConfiguration = defaultPluginNamingConfiguration,
): string =>
  `${getKontentTypeElementTypeName(
    config,
  )}${CONNECTOR}${ELEMENT_OPTION_IDENTIFIER}`;

const getKontentTypesCacheKey = (
  config: PluginNamingConfiguration = defaultPluginNamingConfiguration,
): string =>
  `${config.prefix}${CONNECTOR}${TYPE_IDENTIFIER}${CONNECTOR}${CACHE_IDENTIFIER}`;

const getKontentItemsSchemaNamingConfiguration = (
  config: PluginNamingConfiguration = defaultPluginNamingConfiguration,
): string => {
  return (
    ItemsSchemaTemplate
      .replace(
        /__KONTENT_ITEM_INTERFACE__/g,
        getKontentItemInterfaceName(config),
      )
      .replace(
        /__KONTENT_ITEM_SYSTEM_TYPE__/g,
        getKontentItemSystemElementTypeName(config),
      )
      // elements
      .replace(
        /__KONTENT_ITEM_TEXT_ELEMENT__/g,
        getKontentItemElementTypeNameByType('text', config),
      )
      .replace(
        /__KONTENT_ITEM_RICH_TEXT_ELEMENT__/g,
        getKontentItemElementTypeNameByType(RICH_TEXT_ELEMENT_TYPE_NAME, config),
      )
      .replace(
        /__KONTENT_ITEM_NUMBER_ELEMENT__/g,
        getKontentItemElementTypeNameByType('number', config),
      )
      .replace(
        /__KONTENT_ITEM_MULTIPLE_CHOICE_ELEMENT__/g,
        getKontentItemElementTypeNameByType('multiple_choice', config),
      )
      .replace(
        /__KONTENT_ITEM_DATE_TIME_ELEMENT__/g,
        getKontentItemElementTypeNameByType('date_time', config),
      )
      .replace(
        /__KONTENT_ITEM_ASSET_ELEMENT__/g,
        getKontentItemElementTypeNameByType('asset', config),
      )
      .replace(
        /__KONTENT_ITEM_MODULAR_CONTENT_ELEMENT__/g,
        getKontentItemElementTypeNameByType('modular_content', config),
      )
      .replace(
        /__KONTENT_ITEM_CUSTOM_ELEMENT_ELEMENT__/g,
        getKontentItemElementTypeNameByType('custom', config),
      )
      .replace(
        /__KONTENT_ITEM_TAXONOMY_ELEMENT__/g,
        getKontentItemElementTypeNameByType('taxonomy', config),
      )
      .replace(
        /__KONTENT_ITEM_URL_SLUG_ELEMENT__/g,
        getKontentItemElementTypeNameByType('url_slug', config),
      )
      // element values
      .replace(
        /__KONTENT_ELEMENT_MULTIPLE_CHOICE_VALUE__/g,
        getKontentItemElementValueTypeNameByType('multiple_choice', config),
      )
      .replace(
        /__KONTENT_ELEMENT_ASSET_VALUE__/g,
        getKontentItemElementValueTypeNameByType('asset', config),
      )
      .replace(
        /__KONTENT_ELEMENT_TAXONOMY_VALUE__/g,
        getKontentItemElementValueTypeNameByType('taxonomy', config),
      )
      .replace(
        /__KONTENT_ELEMENT_RICH_TEXT_IMAGE_VALUE__/g,
        `${getKontentItemElementValueTypeNameByType(
          RICH_TEXT_ELEMENT_TYPE_NAME,
          config,
        )}${CONNECTOR}image`,
      )
      .replace(
        /__KONTENT_ELEMENT_RICH_TEXT_LINK_VALUE__/g,
        `${getKontentItemElementValueTypeNameByType(
          RICH_TEXT_ELEMENT_TYPE_NAME,
          config,
        )}${CONNECTOR}link`,
      )
      // extensions
      .replace(
        /__KONTENT_ITEM_LANGUAGE_EXTENSION__/g,
        getKontentItemLanguageLinkExtensionName(config),
      )
      .replace(
        /__KONTENT_ITEM_PREFERRED_LANGUAGE_IDENTIFIER__/g,
        PREFERRED_LANGUAGE_IDENTIFIER,
      )
  );
};

const getKontentTaxonomiesSchemaNamingConfiguration = (
  config: PluginNamingConfiguration = defaultPluginNamingConfiguration,
): string => {
  return TaxonomiesSchemaTemplate
    .replace(/__KONTENT_TAXONOMY_NAME__/g, getKontentTaxonomyTypeName(config))
    .replace(
      /__KONTENT_TAXONOMY_SYSTEM_TYPE__/g,
      getKontentTaxonomySystemElementTypeName(config),
    )
    .replace(
      /__KONTENT_TAXONOMY_TERM_TYPE__/g,
      getKontentTaxonomyTermTypeName(config),
    );
};

const getKontentTypesSchemaNamingConfiguration = (
  config: PluginNamingConfiguration = defaultPluginNamingConfiguration,
): string => {
  return TypesSchemaTemplate
    .replace(/__KONTENT_TYPE_NAME__/g, getKontentTypeTypeName(config))
    .replace(
      /__KONTENT_TYPE_SYSTEM_TYPE__/g,
      getKontentTypeSystemElementTypeName(config),
    )
    .replace(
      /__KONTENT_TYPE_ELEMENT_TYPE__/g,
      getKontentTypeElementTypeName(config),
    )
    .replace(
      /__KONTENT_TYPE_ELEMENT_OPTIONS_TYPE__/g,
      getKontentTypeElementOptionTypeName(config),
    );
};

export {
  getKontentItemNodeStringForId,
  getKontentItemNodeTypeName,
  getKontentItemSystemElementTypeName,
  getKontentItemInterfaceName,
  getKontentItemElementTypeNameByType,
  getKontentItemElementsSchemaTypeName,
  getKontentItemLanguageLinkExtensionName,
  getKontentTaxonomyNodeStringForCodeName,
  getKontentTaxonomyTypeName,
  getKontentTypeNodeStringForCodeName,
  getKontentTypeTypeName,
  getKontentTypesCacheKey,
  getKontentItemsSchemaNamingConfiguration,
  getKontentTaxonomiesSchemaNamingConfiguration,
  getKontentTypesSchemaNamingConfiguration,
  PREFERRED_LANGUAGE_IDENTIFIER,
  RICH_TEXT_ELEMENT_TYPE_NAME
};
