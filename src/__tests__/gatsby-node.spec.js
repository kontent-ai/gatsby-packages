const { TestHttpService } = require('kentico-cloud-core');

const { customTrackingHeader, sourceNodes } = require('../gatsby-node');
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

describe('sourceNodes', () => {
  it('does add tracking header', async () => {
    const deliveryClientConfig = {
      projectId: 'dummyEmptyProject',
      httpService: new TestHttpService({
        fakeResponseJson: {
          types: [],
          items: [],
          pagination: {
            continuation_token: null,
            next_page: null,
          },
        },
        throwCloudError: false,
      }),
    };

    await sourceNodes(
      {
        actions: {
          createNode: jest.fn(),
        },
        createNodeId: jest.fn(),
      },
      {
        deliveryClientConfig,
        languageCodenames: ['default'],
      }
    );

    expect(deliveryClientConfig.customHeaders)
      .toContainEqual(customTrackingHeader);
  });
});

