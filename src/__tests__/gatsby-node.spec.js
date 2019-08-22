const { KenticoCloudJsSdkTestHttpService }
  = require('kentico-cloud-js-sdk-test-http-service');
const { ContentItem, TypeResolver } = require('kentico-cloud-delivery');

const { sourceNodes } = require('../gatsby-node');
const { customTrackingHeader } = require('../config');
const { name, version } = require('../../package.json');
const fakeItemsResponseWithRichTextElement =
  require('./fakeItemsResponseWithRichTextElement.json');
const fakeTypesResponseWithRichTextElement =
  require('./fakeTypesResponseWithRichTextElement.json');
const complexContentItemsFirstLanguageFakeReponse =
  require('./complexContentItemsFirstLanguageFakeReponse.json');
const complexContentItemsSecondtLanguageFakeReponse =
  require('./complexContentItemsSecondLanguageFakeReponse.json');
const complexTypesFakeResponse =
  require('./complexTypesFakeResponse.json');

const {
  expectedResolvedRichTextComponent,
  expectedResolvedRichTextImages,
} = require('./expectedOutputs/gatsby-node.output');


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
  const dummyCreateNodeID = jest.fn();
  dummyCreateNodeID.mockReturnValue('dummyId');

  const dummyCreation = {
    actions: {
      createNode: jest.fn(),
    },
    createNodeId: dummyCreateNodeID,
  };

  describe('tracking header tests', () => {
    const fakeEmptyResponseConfig = new Map();
    fakeEmptyResponseConfig.set(
      /https:\/\/deliver.kenticocloud.com\/.*\/items/,
      {
        fakeResponseJson: {
          items: [],
          pagination: {
            continuation_token: null,
            next_page: null,
          },
        },
        throwCloudError: false,
      });
    fakeEmptyResponseConfig.set(
      /https:\/\/deliver.kenticocloud.com\/.*\/types/,
      {
        fakeResponseJson: {
          types: [],
          pagination: {
            continuation_token: null,
            next_page: null,
          },
        },
        throwCloudError: false,
      });

    const fakeEmptyTestService =
      new KenticoCloudJsSdkTestHttpService(fakeEmptyResponseConfig);


    it('does add tracking header', async () => {
      const deliveryClientConfig = {
        projectId: 'dummyEmptyProject',
        httpService: fakeEmptyTestService,
      };

      await sourceNodes(
        dummyCreation,
        {
          deliveryClientConfig,
          languageCodenames: ['default'],
        }
      );

      expect(deliveryClientConfig.globalHeaders(deliveryClientConfig))
        .toContainEqual(customTrackingHeader);
    });

    it('does update tracking header value', async () => {
      const deliveryClientConfig = {
        projectId: 'dummyEmptyProject',
        httpService: fakeEmptyTestService,
        globalHeaders: ((_) => [
          {
            header: customTrackingHeader.header,
            value: 'dummyValue',
          },
        ]),
      };

      await sourceNodes(
        dummyCreation,
        {
          deliveryClientConfig,
          languageCodenames: ['default'],
        }
      );

      expect(deliveryClientConfig.globalHeaders(deliveryClientConfig))
        .toContainEqual(customTrackingHeader);
      expect(deliveryClientConfig.globalHeaders(deliveryClientConfig).length)
        .toEqual(1);
    });

    it('does not influence other tracking header value', async () => {
      const anotherHeader = {
        header: 'another-header-name',
        value: 'dummyValue',
      };
      const deliveryClientConfig = {
        projectId: 'dummyEmptyProject',
        httpService: fakeEmptyTestService,
        globalHeaders: ((_) => [
          anotherHeader,
        ]),
      };

      await sourceNodes(
        dummyCreation,
        {
          deliveryClientConfig,
          languageCodenames: ['default'],
        }
      );

      expect(deliveryClientConfig.globalHeaders(deliveryClientConfig))
        .toContainEqual(customTrackingHeader);
      expect(deliveryClientConfig.globalHeaders(deliveryClientConfig))
        .toContainEqual(anotherHeader);
      expect(deliveryClientConfig.globalHeaders(deliveryClientConfig).length)
        .toEqual(2);
    });
  });

  describe('rich text section', () => {
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


    it('does resolve rich text element', async () => {
      const fakeRichTextResponseConfig = new Map();
      fakeRichTextResponseConfig.set(
        /https:\/\/deliver.kenticocloud.com\/.*\/items/,
        {
          fakeResponseJson: fakeItemsResponseWithRichTextElement,
          throwCloudError: false,
        });
      fakeRichTextResponseConfig.set(
        /https:\/\/deliver.kenticocloud.com\/.*\/types/,
        {
          fakeResponseJson: fakeTypesResponseWithRichTextElement,
          throwCloudError: false,
        });
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
      const expectedRichTextValue = fakeItemsResponseWithRichTextElement
        .items
        .filter((item) => item.system.codename === 'simple_landing_page')[0]
        .elements
        .content
        .value;

      const createNodeMock = jest.fn();
      const actions = {
        actions: {
          createNode: createNodeMock,
        },
        createNodeId: dummyCreation.createNodeId,
      };
      const pluginConfiguration = {
        deliveryClientConfig,
        languageCodenames: ['default'],
      };

      await sourceNodes(actions, pluginConfiguration);

      const landingPageCallNodeSelection = createNodeMock
        .mock
        .calls
        .filter((call) => {
          const firstArgument = call[0];
          return firstArgument.internal.type.startsWith('KenticoCloudItem')
            && firstArgument.system.codename === 'simple_landing_page';
        });

      expect(landingPageCallNodeSelection).toHaveLength(1);
      expect(landingPageCallNodeSelection[0]).toHaveLength(1);
      const landingPageNode = landingPageCallNodeSelection[0][0];

      expect(landingPageNode)
        .toHaveProperty(
          'elements.content.value',
          expectedRichTextValue
        );
      expect(landingPageNode)
        .toHaveProperty(
          'elements.content.images',
          expectedResolvedRichTextImages
        );
      expect(landingPageNode)
        .toHaveProperty(
          'elements.content.resolvedHtml',
          expectedResolvedRichTextComponent
        );
      expect(landingPageNode)
        .toHaveProperty('elements.content.linked_items___NODE');
      expect(landingPageNode.elements.content.linked_items___NODE)
        .toHaveLength(2);
    });
  });

  describe('complex multilingual data section', () => {
    const fakeComplexConfig = new Map();
    fakeComplexConfig.set(
      /https:\/\/deliver.kenticocloud.com\/.*\/items.*Another_language.*/,
      {
        fakeResponseJson: complexContentItemsSecondtLanguageFakeReponse,
        throwCloudError: false,
      });
    fakeComplexConfig.set(
      /https:\/\/deliver.kenticocloud.com\/.*\/items/,
      {
        fakeResponseJson: complexContentItemsFirstLanguageFakeReponse,
        throwCloudError: false,
      });
    fakeComplexConfig.set(
      /https:\/\/deliver.kenticocloud.com\/.*\/types/,
      {
        fakeResponseJson: complexTypesFakeResponse,
        throwCloudError: false,
      });

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
        fakeComplexConfig
      ),
    };

    const pluginConfiguration = {
      deliveryClientConfig,
      languageCodenames: ['default', 'Another_language'],
    };

    it('resolve all element types in two languages', async () => {
      await sourceNodes(actions, pluginConfiguration);

      const calls = createNodeMock.mock.calls;
      expect(calls).toMatchSnapshot();
    });
  });
});


