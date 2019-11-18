const { KontentTestHttpService }
  = require('@kentico/kontent-test-http-service-js');

// Project ID 71be1cca-0be3-0159-fdfe-6cf11b092e68
const richtextCircularReferenceFakeItemsResponse =
  require('./richtextCircularReferenceFakeItemsResponse.json');
const richtextCircularReferenceFakeTypesResponse =
  require('./richtextCircularReferenceFakeTypesResponse.json');

const { sourceNodes } = require('../../gatsby-node');


describe(`Rich text resolution reference in modular content`, () => {
  const fakeRichTextResponseConfig = new Map();
  fakeRichTextResponseConfig.set(
    /https:\/\/deliver.kontent.ai\/.*\/items/,
    {
      fakeResponseJson: richtextCircularReferenceFakeItemsResponse,
      throwError: false,
    });

  fakeRichTextResponseConfig.set(
    /https:\/\/deliver.kontent.ai\/.*\/types/,
    {
      fakeResponseJson: richtextCircularReferenceFakeTypesResponse,
      throwError: false,
    });

  const dummyCreateNodeID = jest.fn();
  dummyCreateNodeID.mockImplementation((input) => `dummy-${input}`);

  const createNodeMock = jest.fn();
  const createTypesMock = jest.fn();
  const schemaDummy = { buildObjectType: jest.fn((input) => ({
    data: input,
  }))}; ;

  const actions = {
    actions: {
      createNode: createNodeMock,
      createTypes: createTypesMock,
    },
    createNodeId: dummyCreateNodeID,
    schema: schemaDummy,
  };

  const deliveryClientConfig = {
    projectId: 'dummyProject',
    typeResolvers: [],
    httpService: new KontentTestHttpService(
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
