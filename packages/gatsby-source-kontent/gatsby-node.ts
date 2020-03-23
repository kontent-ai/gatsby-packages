import { CustomPluginOptions, CustomCreateSchemaCustomizationArgs } from "./src/types";

import { kontentItemsCreateSchemaCustomization } from './src/createSchemaCustomization.items';
import { kontentItemsSourceNodes } from './src/sourceNodes.items';
import { SourceNodesArgs } from "gatsby";
import { kontentTaxonomiesCreateSchemaCustomization } from "./src/createSchemaCustomization.taxonomies";
import { kontentTaxonomiesSourceNodes } from "./src/sourceNodes.taxonomies";

export { kontentItemsCreateSchemaCustomization as createSchemaCustomization, kontentItemsSourceNodes as sourceNodes };

exports.createSchemaCustomization = (api: CustomCreateSchemaCustomizationArgs, pluginConfig: CustomPluginOptions): void => {
  kontentItemsCreateSchemaCustomization(api, pluginConfig);
  kontentTaxonomiesCreateSchemaCustomization(api);
}

exports.sourceNodes = (api: SourceNodesArgs, pluginConfig: CustomPluginOptions): void => {
  kontentItemsSourceNodes(api, pluginConfig);
  kontentTaxonomiesSourceNodes(api, pluginConfig);
}


