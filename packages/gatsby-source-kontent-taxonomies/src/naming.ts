import { PluginNamingConfiguration } from "./types";

const CONNECTOR = "_";
const SYSTEM_IDENTIFIER = "system";
const TERM_IDENTIFIER = "term";
const defaultPluginNamingConfiguration: PluginNamingConfiguration = {
  prefix: `kontent${CONNECTOR}taxonomy`,
};

const getKontentTaxonomyNodeStringForCodeName = (codename: string, config: PluginNamingConfiguration = defaultPluginNamingConfiguration): string =>
  `${config.prefix}${CONNECTOR}${codename}`;

const getKontentTaxonomyTypeName = (config: PluginNamingConfiguration = defaultPluginNamingConfiguration): string =>
  `${config.prefix}`;
const getKontentTaxonomySystemElementTypeName = (config: PluginNamingConfiguration = defaultPluginNamingConfiguration): string =>
  `${config.prefix}${CONNECTOR}${SYSTEM_IDENTIFIER}`;
const getKontentTaxonomyTermTypeName = (config: PluginNamingConfiguration = defaultPluginNamingConfiguration): string =>
  `${config.prefix}${CONNECTOR}${TERM_IDENTIFIER}`;
  

const getSchemaNamingConfiguration = (template: string, config: PluginNamingConfiguration = defaultPluginNamingConfiguration): string =>
  template
    .replace(/__KONTENT_TAXONOMY_NAME__/g, getKontentTaxonomyTypeName(config))
    .replace(/__KONTENT_TAXONOMY_SYSTEM_TYPE__/g, getKontentTaxonomySystemElementTypeName(config))
    .replace(/__KONTENT_TAXONOMY_TERM_TYPE__/g, getKontentTaxonomyTermTypeName(config))

export {
  getKontentTaxonomyNodeStringForCodeName,
  getSchemaNamingConfiguration,
  getKontentTaxonomyTypeName
}