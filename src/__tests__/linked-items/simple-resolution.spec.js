
const { KenticoCloudJsSdkTestHttpService }
  = require('kentico-cloud-js-sdk-test-http-service');

const { sourceNodes } = require('../../../gatsby-node');

// Project ID 4ac85e55-6daf-0122-7a52-81a12e5d986a
const simpleLinkedItemFakeItemsResponse =
  require('./simpleLinkedItemFakeItemsResponse.json');
const fakeTypeResponse =
  require('./fakeTypeResponse.json');

describe(
  `Simple linked items element contains reference to another items`,
  async () => {
    const fakeHttpServiceConfig = new Map();
    fakeHttpServiceConfig.set(
      /https:\/\/deliver.kenticocloud.com\/.*\/items/,
      {
        fakeResponseJson: simpleLinkedItemFakeItemsResponse,
        throwCloudError: false,
      });
    fakeHttpServiceConfig.set(
      /https:\/\/deliver.kenticocloud.com\/.*\/types/,
      {
        fakeResponseJson: fakeTypeResponse,
        throwCloudError: false,
      });

    const dummyCreateNodeID = jest.fn();
    dummyCreateNodeID.mockImplementation((input) => `dummy-${input}`);

    const dummyCreation = {
      actions: {
        createNode: jest.fn(),
      },
      createNodeId: dummyCreateNodeID,
    };
    const createNodeMock = jest.fn();
    const actions = {
      actions: {
        createNode: createNodeMock,
      },
      createNodeId: dummyCreation.createNodeId,
    };

    const deliveryClientConfig = {
      projectId: 'dummyProject',
      typeResolvers: [],
      httpService: new KenticoCloudJsSdkTestHttpService(
        fakeHttpServiceConfig
      ),
    };

    const pluginConfiguration = {
      deliveryClientConfig,
      languageCodenames: ['default'],
    };

    it('passes with no error', async () => {
      await sourceNodes(actions, pluginConfiguration);

      const calls = createNodeMock.mock.calls;
      expect(calls).toMatchSnapshot();
    });
  });
