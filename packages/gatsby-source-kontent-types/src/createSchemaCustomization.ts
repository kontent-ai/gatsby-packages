import { CustomPluginOptions, CustomCreateSchemaCustomizationArgs } from "./types";
import * as fs from "fs";
import * as path from "path";

const createSchemaCustomization = async (api: CustomCreateSchemaCustomizationArgs, pluginConfig: CustomPluginOptions): Promise<void> => {
  const baseSchemaTypes = fs.readFileSync(path.join(__dirname, "template.schema.gql"), "utf8");
  api.actions.createTypes(baseSchemaTypes);
};

export {
  createSchemaCustomization
}