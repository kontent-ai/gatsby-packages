import { CreateSchemaCustomizationArgs, SourceNodesArgs } from 'gatsby';
import { debounce, isEmpty } from 'lodash';

import { kontentItemsCreateSchemaCustomization } from './src/createSchemaCustomization.items';
import { kontentTaxonomiesCreateSchemaCustomization } from './src/createSchemaCustomization.taxonomies';
import { kontentTypesCreateSchemaCustomization } from './src/createSchemaCustomization.types';
import { pluginOptionsSchema } from './src/pluginOptionsSchema';
import { kontentItemsSourceNodes } from './src/sourceNodes.items';
import { kontentTaxonomiesSourceNodes } from './src/sourceNodes.taxonomies';
import { kontentTypesSourceNodes } from './src/sourceNodes.types';
import { CustomPluginOptions } from './src/types';
import { handleIncomingWebhook } from './src/webhookProcessor';

let itemTypes: string[];

exports.pluginOptionsSchema = ({ Joi }: { Joi: any }) => {
  return pluginOptionsSchema({ Joi });
};

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

const debounceWait =
  process.env.KONTENT_WEBHOOK_DEBOUNCE !== undefined
    ? parseFloat(process.env.KONTENT_WEBHOOK_DEBOUNCE)
    : undefined;

const debounceWebhook = debounce(async (api, pluginConfig) => {
  await handleIncomingWebhook(api, pluginConfig, itemTypes);
}, debounceWait);

exports.sourceNodes = async (
  api: SourceNodesArgs,
  pluginConfig: CustomPluginOptions,
): Promise<void> => {
  try {
    if (!isEmpty(api.webhookBody)) {
      //preview run

      if (debounceWait !== undefined) {
        debounceWebhook(api, pluginConfig);
      } else {
        await handleIncomingWebhook(api, pluginConfig, itemTypes);
      }

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
