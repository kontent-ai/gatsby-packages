const { KontentTestHttpService }
  = require('@kentico/kontent-test-http-service-js');
const { ContentItem, TypeResolver } = require('@kentico/kontent-delivery');

// Project ID 71be1cca-0be3-0159-fdfe-6cf11b092e68
const richtextFakeItemsResponse =
  require('./richtextFakeItemsResponse.json');
const richtextFakeTypesResponse =
  require('./richtextFakeTypesResponse.json');

const { sourceNodes } = require('../../gatsby-node');


describe(`Rich text resolution reference in modular content`, () => {
  const fakeRichTextResponseConfig = new Map();
  fakeRichTextResponseConfig.set(
    /https:\/\/deliver.kontent.ai\/.*\/items/,
    {
      fakeResponseJson: richtextFakeItemsResponse,
      throwError: false,
    });

  fakeRichTextResponseConfig.set(
    /https:\/\/deliver.kontent.ai\/.*\/types/,
    {
      fakeResponseJson: richtextFakeTypesResponse,
      throwError: false,
    });

  const dummyCreateNodeID = jest.fn();
  dummyCreateNodeID.mockImplementation((input) => `dummy-${input}`);

  const createNodeMock = jest.fn();
  const createTypesMock = jest.fn();
  const mockedSchema = { buildObjectType: jest.fn((input) => ({
    data: input,
  }))};

  const actions = {
    actions: {
      createNode: createNodeMock,
      createTypes: createTypesMock,
    },
    createNodeId: dummyCreateNodeID,
    schema: mockedSchema,
  };

  class LandingPageImageSection extends ContentItem {
    constructor() {
      super({
        richTextResolver: (_contentItem, _context) =>
          '###landing_page_image_section###',
      });
    }
  }

  class Project extends ContentItem {
    constructor() {
      super({
        urlSlugResolver: (_link, _context) => ({ url: '###projectlink###' }),
        richTextResolver: (_contentItem, _context) =>
          '###project###',
      });
    }
  }

  const deliveryClientConfig = {
    projectId: 'dummyProject',
    typeResolvers: [
      new TypeResolver('landing_page_image_section', (rawData) =>
        new LandingPageImageSection(rawData)
      ),
      new TypeResolver('project', (rawData) =>
        new Project(rawData)),
    ],
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
