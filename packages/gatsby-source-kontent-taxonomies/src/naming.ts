import * as fs from "fs";
import * as path from "path";
import { PluginNamingConfiguration } from "./types";

const CONNECTOR = "_";
const SYSTEM_IDENTIFIER = "system";
const TERM_IDENTIFIER = "term";
const TAXONOMY_IDENTIFIER = "taxonomy";
const defaultPluginNamingConfiguration: PluginNamingConfiguration = {
  prefix: `kontent`,
};

const getKontentTaxonomyNodeStringForCodeName = (codename: string, config: PluginNamingConfiguration = defaultPluginNamingConfiguration): string =>
  `${config.prefix}${CONNECTOR}${TAXONOMY_IDENTIFIER}${CONNECTOR}${codename}`;

const getKontentTaxonomyTypeName = (config: PluginNamingConfiguration = defaultPluginNamingConfiguration): string =>
  `${config.prefix}${CONNECTOR}${TAXONOMY_IDENTIFIER}`;

const getKontentTaxonomySystemElementTypeName = (config: PluginNamingConfiguration = defaultPluginNamingConfiguration): string =>
  `${config.prefix}${CONNECTOR}${TAXONOMY_IDENTIFIER}${CONNECTOR}${SYSTEM_IDENTIFIER}`;

const getKontentTaxonomyTermTypeName = (config: PluginNamingConfiguration = defaultPluginNamingConfiguration): string =>
  `${config.prefix}${CONNECTOR}${TAXONOMY_IDENTIFIER}${CONNECTOR}${TERM_IDENTIFIER}`;


const getKontentTaxonomiesSchemaNamingConfiguration = (config: PluginNamingConfiguration = defaultPluginNamingConfiguration): string => {
  const template = fs.readFileSync(path.join(__dirname, "template.taxonomies.schema.gql"), "utf8");
  return template
    .replace(/__KONTENT_TAXONOMY_NAME__/g, getKontentTaxonomyTypeName(config))
    .replace(/__KONTENT_TAXONOMY_SYSTEM_TYPE__/g, getKontentTaxonomySystemElementTypeName(config))
    .replace(/__KONTENT_TAXONOMY_TERM_TYPE__/g, getKontentTaxonomyTermTypeName(config))
}
export {
  getKontentTaxonomyNodeStringForCodeName,
  getKontentTaxonomiesSchemaNamingConfiguration,
  getKontentTaxonomyTypeName
}