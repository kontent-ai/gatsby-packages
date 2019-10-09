const { KenticoCloudJsSdkTestHttpService }
  = require('kentico-cloud-js-sdk-test-http-service');
const { ContentItem, TypeResolver } = require('kentico-cloud-delivery');

// Project ID 71be1cca-0be3-0159-fdfe-6cf11b092e68
const richtextCircularReferenceFakeItemsResponse =
  require('./richtextCircularReferenceFakeItemsResponse.json');
const richtextCircularReferenceFakeTypesResponse =
  require('./richtextCircularReferenceFakeTypesResponse.json');

const { sourceNodes } = require('../../../gatsby-node');


describe(`Rich text resolution reference in modular content`, async () => {

  const fakeRichTextResponseConfig = new Map();
  fakeRichTextResponseConfig.set(
    /https:\/\/deliver.kenticocloud.com\/.*\/items/,
    {
      fakeResponseJson: richtextCircularReferenceFakeItemsResponse,
      throwCloudError: false,
    });

  fakeRichTextResponseConfig.set(
    /https:\/\/deliver.kenticocloud.com\/.*\/types/,
    {
      fakeResponseJson: richtextCircularReferenceFakeTypesResponse,
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
      fakeRichTextResponseConfig
    ),
  };

  const pluginConfiguration = {
    deliveryClientConfig,
    languageCodenames: ['default'],
  };

  it('resolves values using resolvers in rich text', async () => {
    await sourceNodes(actions, pluginConfiguration);

    const calls = createNodeMock.mock.calls;
    expect(calls).toMatchSnapshot();
  });
});
