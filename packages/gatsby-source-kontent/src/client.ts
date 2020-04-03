import * as rax from 'retry-axios';
import axios, { AxiosError } from 'axios';
import {
  KontentItem,
  KontentType,
  KontentTaxonomy,
  CustomPluginOptions,
} from './types';
import * as _ from 'lodash';
import {
  name as packageName,
  version as packageVersion,
} from '../package.json';

const KontentDeliveryProductionDomain = 'https://deliver.kontent.ai';
const KontentDeliveryPreviewDomain = 'https://preview-deliver.kontent.ai';
const continuationHeaderName = 'x-continuation';
const authorizationHeaderName = 'authorization';
const trackingHeaderName = 'x-kc-source';

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
  [trackingHeaderName]?: string;
}

const ensureAuthorizationHeader = (
  config: CustomPluginOptions,
  headers?: KontentHttpHeaders | undefined,
): KontentHttpHeaders => {
  if (!config.authorizationKey) {
    return headers || {};
  }

  if (headers) {
    headers[authorizationHeaderName] = `Bearer ${config.authorizationKey}`;
    return headers;
  } else {
    return {
      [authorizationHeaderName]: `Bearer ${config.authorizationKey}`,
    };
  }
};

const ensureTrackingHeader = (
  headers?: KontentHttpHeaders | undefined,
): KontentHttpHeaders => {
  const headerValue = `${packageName};${packageVersion}`;
  if (headers) {
    headers[trackingHeaderName] = headerValue;
    return headers;
  } else {
    return {
      [trackingHeaderName]: headerValue,
    };
  }
};

const loadAllKontentItems = async (
  config: CustomPluginOptions,
  language: string,
): Promise<KontentItem[]> => {
  let continuationToken = '';
  const items = [];
  const headers = ensureAuthorizationHeader(config);
  ensureTrackingHeader(headers);
  do {
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
  const headers = ensureAuthorizationHeader(config);
  ensureTrackingHeader(headers);
  const response = await axios.get(
    `${getDomain(config)}/${config.projectId}/types`,
    {
      headers,
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
  const headers = ensureAuthorizationHeader(config);
  ensureTrackingHeader(headers);
  const response = await axios.get(
    `${getDomain(config)}/${config.projectId}/taxonomies`,
    {
      headers,
      raxConfig: {
        onRetryAttempt: logRetryAttempt,
      },
    },
  );
  return response.data.taxonomies;
};

export { loadAllKontentItems, loadAllKontentTypes, loadAllKontentTaxonomies };
