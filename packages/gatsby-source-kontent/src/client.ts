import * as rax from 'retry-axios';
import axios, { AxiosError } from 'axios';
import {
  KontentItem,
  KontentType,
  KontentTaxonomy,
  CustomPluginOptions,
} from './types';
import * as _ from 'lodash';

const KontentDeliveryProductionDomain = 'https://deliver.kontent.ai';
const KontentDeliveryPreviewDomain = 'https://preview-deliver.kontent.ai';
const continuationHeaderName = 'x-continuation';
const authorizationHeaderName = 'authorization';

rax.attach();

const getDomain = (options: CustomPluginOptions): string =>
  options.usePreviewUrl
    ? KontentDeliveryPreviewDomain
    : KontentDeliveryProductionDomain;

const logRetryAttempt = (err: AxiosError): void => {
  const cfg = rax.getConfig(err);
  console.log(
    `Error axios request:(url: ${err.response?.config.url}) ${err.message}`,
  );
  console.log(`Retry attempt #${cfg?.currentRetryAttempt}`);
};

interface KontentHttpHeaders {
  [continuationHeaderName]?: string;
  [authorizationHeaderName]?: string;
}

const ensureAuthorizationHeader = (
  config: CustomPluginOptions,
  headers?: KontentHttpHeaders | undefined,
): KontentHttpHeaders => {
  if (!config.authorizationKey) {
    return headers || {};
  }

  if (headers) {
    headers.authorization = `Bearer ${config.authorizationKey}`;
    return headers;
  } else {
    return {
      authorization: `Bearer ${config.authorizationKey}`,
    };
  }
};

const loadAllKontentItems = async (
  config: CustomPluginOptions,
  language: string,
): Promise<KontentItem[]> => {
  let continuationToken = '';
  const items = [];
  do {
    const headers = ensureAuthorizationHeader(config);
    headers[continuationHeaderName] = continuationToken;

    const response = await axios.get(
      `${getDomain(config)}/${
      config.projectId
      }/items-feed?language=${language}`,
      {
        headers,
        raxConfig: {
          onRetryAttempt: logRetryAttempt,
        },
      },
    );

    const union = _.unionBy<KontentItem>(
      response.data.items,
      Object.values(response.data.modular_content),
      'system.codename',
    );
    items.push(...union);
    continuationToken = response.headers[continuationHeaderName];
  } while (continuationToken);

  return items;
};

const loadAllKontentTypes = async (
  config: CustomPluginOptions,
): Promise<KontentType[]> => {
  const response = await axios.get(
    `${getDomain(config)}/${config.projectId}/types`,
    {
      headers: ensureAuthorizationHeader(config),
      raxConfig: {
        onRetryAttempt: logRetryAttempt,
      },
    },
  );
  return response.data.types;
};

const loadAllKontentTaxonomies = async (
  config: CustomPluginOptions,
): Promise<KontentTaxonomy[]> => {
  const response = await axios.get(
    `${getDomain(config)}/${config.projectId}/taxonomies`,
    {
      headers: ensureAuthorizationHeader(config),
      raxConfig: {
        onRetryAttempt: logRetryAttempt,
      },
    },
  );
  return response.data.taxonomies;
};

export { loadAllKontentItems, loadAllKontentTypes, loadAllKontentTaxonomies };
