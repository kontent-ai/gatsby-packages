const _ = require(`lodash`);

const customTrackingHeader = {
  header: 'X-KC-SOURCE',
  value: '@kentico/gatsby-source-kontent;5.0.0-beta1',
};

/**
 *
 * @param {DeliveryClientConfig} deliveryClientConfig
 *  Kentico Kontent JS configuration object
 * @param {IHeader} trackingHeader tracking header name
 * @return {DeliveryClientConfig}
 *  The clone of the config enhanced by tracking header
 */
const addHeader = (deliveryClientConfig, trackingHeader) => {
  const resultConfig = _.cloneDeep(deliveryClientConfig);
  resultConfig.globalQueryConfig =
    resultConfig.globalQueryConfig || {};

  if (!resultConfig.globalQueryConfig.customHeaders) {
    resultConfig.globalQueryConfig.customHeaders = [trackingHeader];
    return resultConfig;
  }

  let headers = _.cloneDeep(
    resultConfig
      .globalQueryConfig
      .customHeaders
  );

  if (headers.some((header) => header.header === trackingHeader.header)) {
    console.warn(`Custom HTTP header value with name ${trackingHeader.header}
        will be replaced by the source plugin.
        Use different header name if you want to avoid this behavior;`);
    headers = headers.filter((header) =>
      header.header !== trackingHeader.header);
  }

  headers.push(trackingHeader);
  resultConfig.globalQueryConfig.customHeaders = headers;
  return resultConfig;
};

module.exports = {
  customTrackingHeader,
  addHeader,
};
