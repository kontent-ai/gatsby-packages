const { KenticoCloudJsSdkTestHttpService }
  = require('kentico-cloud-js-sdk-test-http-service');
const { ContentItem, TypeResolver } = require('kentico-cloud-delivery');

// Project ID 71be1cca-0be3-0159-fdfe-6cf11b092e68
const richtextFakeItemsResponse =
  require('./richtextFakeItemsResponse.json');
const richtextFakeTypesResponse =
  require('./richtextFakeTypesResponse.json');

const { sourceNodes } = require('../../../gatsby-node');


describe(`Rich text resolution reference in modular content`, async () => {
  const fakeRichTextResponseConfig = new Map();
  fakeRichTextResponseConfig.set(
    /https:\/\/deliver.kenticocloud.com\/.*\/items/,
    {
      fakeResponseJson: richtextFakeItemsResponse,
      throwCloudError: false,
    });

  fakeRichTextResponseConfig.set(
    /https:\/\/deliver.kenticocloud.com\/.*\/types/,
    {
      fakeResponseJson: richtextFakeTypesResponse,
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
