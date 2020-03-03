
const { KontentTestHttpService }
= require('@kentico/kontent-test-http-service-js');

const { sourceNodes } = require('../../gatsby-node');

// Project ID 532c0844-5eb3-0033-7d1b-faeea1e7e407
const conflictingCodenamesItemsResponse =
require('./conflictingCodenamesItemsResponse.json');
const fakeTypeResponse =
require('./fakeTypeResponse.json');
const fakeTaxonomiesResponse =
require('../fakeTaxonomiesResponse.json');

describe(`Codenames with conflicting underscores`, () => {
  const fakeHttpServiceConfig = new Map();
  fakeHttpServiceConfig.set(
    /https:\/\/deliver.kontent.ai\/.*\/items/,
    {
      fakeResponseJson: conflictingCodenamesItemsResponse,
      throwError: false,
    });
  fakeHttpServiceConfig.set(
    /https:\/\/deliver.kontent.ai\/.*\/types/,
    {
      fakeResponseJson: fakeTypeResponse,
      throwError: false,
    });

  fakeHttpServiceConfig.set(
    /https:\/\/deliver.kontent.ai\/.*\/taxonomies/,
    {
      fakeResponseJson: fakeTaxonomiesResponse,
      throwError: false,
    });

  const dummyCreateNodeID = jest.fn();
  dummyCreateNodeID.mockImplementation((input) => `dummy-${input}`);

  const createNodeMock = jest.fn();
  const createTypesMock = jest.fn();
  const mockedSchema = { buildObjectType: jest.fn((input) => ({
    data: input,
  }))}; ;

  const actions = {
    actions: {
      createNode: createNodeMock,
      createTypes: createTypesMock,
    },
    createNodeId: dummyCreateNodeID,
    schema: mockedSchema,
  };

  const deliveryClientConfig = {
    projectId: 'dummyProject',
    typeResolvers: [],
    httpService: new KontentTestHttpService(
      fakeHttpServiceConfig,
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
