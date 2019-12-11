const { addHeader } = require('../config');
const { customTrackingHeader } = require('../config');
const { name, version } = require('../../package.json');

describe('customTrackingHeader', () => {
  it('has correct name', () => {
    expect(customTrackingHeader.header).toEqual('X-KC-SOURCE');
  });

  it('has correct value according to package name and package version', () => {
    const expectedHeaderValue = `${name};${version}`;
    expect(customTrackingHeader.value).toEqual(expectedHeaderValue);
  });
});

describe('addHeader', () => {
  it('does add tracking header', async () => {
    const deliveryClientConfig = {
      projectId: 'dummyEmptyProject',
    };

    const newConfig = addHeader(deliveryClientConfig, customTrackingHeader);

    expect(newConfig.globalQueryConfig.customHeaders)
      .toContainEqual(customTrackingHeader);
  });

  it('does update tracking header value', async () => {
    const deliveryClientConfig = {
      projectId: 'dummyEmptyProject',
      globalQueryConfig: {
        customHeaders: [{
          header: customTrackingHeader.header,
          value: 'dummyValue',
        }],
      },
    };

    const newConfig = addHeader(deliveryClientConfig, customTrackingHeader);

    expect(newConfig.globalQueryConfig.customHeaders)
      .toContainEqual(customTrackingHeader);
    expect(newConfig.globalQueryConfig.customHeaders.length)
      .toEqual(1);
  });

  it('does not influence other tracking header value', async () => {
    const anotherHeader = {
      header: 'another-header-name',
      value: 'dummyValue',
    };
    const deliveryClientConfig = {
      projectId: 'dummyEmptyProject',
      globalQueryConfig: {
        customHeaders: [
          anotherHeader,
        ],
      },
    };

    const newConfig = addHeader(deliveryClientConfig, customTrackingHeader);

    expect(newConfig.globalQueryConfig.customHeaders)
      .toContainEqual(customTrackingHeader);
    expect(newConfig.globalQueryConfig.customHeaders)
      .toContainEqual(anotherHeader);
    expect(newConfig.globalQueryConfig.customHeaders.length)
      .toEqual(2);
  });
});
