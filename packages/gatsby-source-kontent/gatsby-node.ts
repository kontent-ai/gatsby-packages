import {
  CustomPluginOptions,
} from './src/types';
import { SourceNodesArgs, CreateSchemaCustomizationArgs } from 'gatsby';
import * as _ from "lodash"


import { kontentItemsCreateSchemaCustomization } from './src/createSchemaCustomization.items';
import { kontentItemsSourceNodes } from './src/sourceNodes.items';
import { kontentTaxonomiesCreateSchemaCustomization } from './src/createSchemaCustomization.taxonomies';
import { kontentTaxonomiesSourceNodes } from './src/sourceNodes.taxonomies';
import { kontentTypesCreateSchemaCustomization } from './src/createSchemaCustomization.types';
import { kontentTypesSourceNodes } from './src/sourceNodes.types';
import { handleIncomingWebhook } from './src/webhookProcessor';

let itemTypes: string[];

exports.pluginOptionsSchema = ({ Joi }: { Joi: any }) => {
  return Joi.object({
    projectId: Joi.string()
      .required()
      .description(`Project ID from "Project settings" -> "API keys".`),
    languageCodenames: Joi.array().items(Joi.string())
      .required()
      .description(`Array of language codenames from "Project settings" -> "Localization" - the first one is considered as the default one`),
    includeTypes: Joi.boolean()
      .description(`Include content type nodes to GraphQL model.`)
      .default(false),
    includeTaxonomies: Joi.boolean()
      .description(`Include taxonomy node to GraphQL model.`)
      .default(false),
    authorizationKey: Joi.string()
      .description(`For preview/secured API key - depends on "usePreviewUrl" config`),
    usePreviewUrl: Joi.boolean()      
      .description(`When true, "preview-deliver.kontent.ai" used as primary domain for data source.`)
      .default(false),
    proxy: Joi.object()
      .keys({
        deliveryDomain: Joi.string()
          .description(`Base url used for all requests. Defaults to "deliver.kontent.ai"`),
        previewDeliveryDomain: Joi.string()
          .description(`Base url used for preview requests. Defaults to "preview-deliver.kontent.ai"`)
      })
      .description(`Proxy domain setting object`)
  });
}

exports.createSchemaCustomization = async (
  api: CreateSchemaCustomizationArgs,
  pluginConfig: CustomPluginOptions,
): Promise<void> => {
  try {
    await kontentItemsCreateSchemaCustomization(api, pluginConfig);
    if (pluginConfig.includeTaxonomies) {
      await kontentTaxonomiesCreateSchemaCustomization(api);
    }
    if (pluginConfig.includeTypes) {
      await kontentTypesCreateSchemaCustomization(api);
    }
  } catch (error) {
    api.reporter.error(
      'Gatsby kontent source plugin resulted to error in `createSchemaCustomization` method',
      error,
    );
    api.reporter.verbose(`Complete error: ${JSON.stringify(error, null, 2)}`);
    throw error;
  }
};

exports.sourceNodes = async (
  api: SourceNodesArgs,
  pluginConfig: CustomPluginOptions,
): Promise<void> => {
  try {
    if (!_.isEmpty(api.webhookBody)) { //preview run
      await handleIncomingWebhook(api, pluginConfig, itemTypes);
      return;
    }

    itemTypes = await kontentItemsSourceNodes(api, pluginConfig);

    if (pluginConfig.includeTaxonomies) {
      await kontentTaxonomiesSourceNodes(api, pluginConfig);
    }

    if (pluginConfig.includeTypes) {
      await kontentTypesSourceNodes(api, pluginConfig);
    }
  } catch (error) {
    api.reporter.error(
      'Gatsby kontent source plugin resulted to error in `sourceNodes` method',
      error,
    );
    api.reporter.verbose(`Complete error: ${JSON.stringify(error, null, 2)}`);
    throw error;
  }
};
