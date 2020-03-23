import { CustomPluginOptions, CustomCreateSchemaCustomizationArgs } from "./src/types";

import { kontentItemsCreateSchemaCustomization } from './src/createSchemaCustomization.items';
import { kontentItemsSourceNodes } from './src/sourceNodes.items';
import { SourceNodesArgs } from "gatsby";

export { kontentItemsCreateSchemaCustomization as createSchemaCustomization, kontentItemsSourceNodes as sourceNodes };

exports.createSchemaCustomization = (api: CustomCreateSchemaCustomizationArgs, pluginConfig: CustomPluginOptions): void => {
  kontentItemsCreateSchemaCustomization(api, pluginConfig);
}

exports.sourceNodes = (api: SourceNodesArgs, pluginConfig: CustomPluginOptions): void => {
  kontentItemsSourceNodes(api, pluginConfig);
}


