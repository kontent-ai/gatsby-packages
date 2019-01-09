const { TestHttpService } = require('kentico-cloud-core');

const { sourceNodes } = require('../gatsby-node');
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

describe('sourceNodes', () => {
  const fakeEmptyResponse = {
    types: [],
    items: [],
    pagination: {
      continuation_token: null,
      next_page: null,
    },
  };
  const fakeTestService = new TestHttpService({
    fakeResponseJson: fakeEmptyResponse,
    throwCloudError: false,
  });

  it('does add tracking header', async () => {
    const deliveryClientConfig = {
      projectId: 'dummyEmptyProject',
      httpService: fakeTestService,
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

  it('does update tracking header value', async () => {
    const deliveryClientConfig = {
      projectId: 'dummyEmptyProject',
      httpService: fakeTestService,
      customHeaders: [
        {
          header: customTrackingHeader.header,
          value: 'dummyValue',
        },
      ],
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
    expect(deliveryClientConfig.customHeaders.length)
      .toEqual(1);
  });

  it('does not influence other tracking header value', async () => {
    const anotherHeader = {
      header: 'another-header-name',
      value: 'dummyValue',
    };
    const deliveryClientConfig = {
      projectId: 'dummyEmptyProject',
      httpService: fakeTestService,
      customHeaders: [
        anotherHeader,
      ],
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
    expect(deliveryClientConfig.customHeaders)
      .toContainEqual(anotherHeader);
    expect(deliveryClientConfig.customHeaders.length)
      .toEqual(2);
  });
});

