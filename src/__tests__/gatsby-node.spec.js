const { TestHttpService } = require('kentico-cloud-core');
const { ContentItem, TypeResolver } = require('kentico-cloud-delivery');

const { sourceNodes } = require('../gatsby-node');
const { customTrackingHeader } = require('../config');
const { name, version } = require('../../package.json');
const fakeResponseWithRichTextElement =
  require('./fakeResponseWithRichTextElement.json');
const { expectedResolvedRichTextComponent } =
  require('./expectedOutputs/gatsby-node');


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
  const fakeEmptyTestService = new TestHttpService({
    fakeResponseJson: fakeEmptyResponse,
    throwCloudError: false,
  });

  it('does add tracking header', async () => {
    const deliveryClientConfig = {
      projectId: 'dummyEmptyProject',
      httpService: fakeEmptyTestService,
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
      httpService: fakeEmptyTestService,
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
      httpService: fakeEmptyTestService,
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
        linkResolver: (_link, _context) => '###projectlink###',
      });
    }
  }


  it('does resolve rich text element', async () => {
    const deliveryClientConfig = {
      projectId: 'dumyProject',
      typeResolvers: [
        new TypeResolver('landing_page_image_section', () =>
          new LandingPageImageSection()
        ),
        new TypeResolver('project', () =>
          new Project()),
      ],
      httpService: new TestHttpService({
        fakeResponseJson: fakeResponseWithRichTextElement,
        throwCloudError: false,
      }),
    };
    const expectedRichTextValue = fakeResponseWithRichTextElement
      .items
      .filter((item) => item.system.codename === 'simple_landing_page')[0]
      .elements
      .content
      .value;
    const expectedResolveHtml = `<h1>Landing page</h1>
    <p><br>
    Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Duis condimentum augue id magna semper rutrum. Phasellus faucibus molestie nisl. Aliquam erat volutpat. Fusce consectetuer risus a nunc. Duis viverra diam non justo. Etiam commodo dui eget wisi. In enim a arcu imperdiet malesuada. Curabitur ligula sapien, pulvinar a vestibulum quis, facilisis vel sapien. Vivamus ac leo pretium faucibus. Nulla non arcu lacinia neque faucibus fringilla. Duis pulvinar. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos hymenaeos. Nulla est. Proin in tellus sit amet nibh dignissim sagittis. Aliquam erat volutpat. Donec iaculis gravida nulla. Integer malesuada. Proin mattis lacinia justo.</p>
    <p><br></p>
    <p type="application/kenticocloud" data-type="item" data-rel="component" data-codename="n26ddfb46_c2de_010e_3ad9_ec9aa8955144" class="kc-linked-item-wrapper">###landing_page_image_section###</p>
    <p>In convallis. Vivamus porttitor turpis ac leo. Proin in tellus sit amet nibh dignissim sagittis. Nulla non arcu lacinia neque faucibus fringilla. Fusce wisi. Aenean id metus id velit ullamcorper pulvinar. Nullam eget nisl. Proin in tellus sit amet nibh dignissim sagittis. Cras pede libero, dapibus nec, pretium sit amet, tempor quis. Etiam ligula pede, sagittis quis, interdum ultricies, scelerisque eu. In rutrum. Vivamus ac leo pretium faucibus. Nulla accumsan, elit sit amet varius semper, nulla mauris mollis quam, tempor suscipit diam nulla vel leo. Etiam neque. Morbi scelerisque luctus velit. Integer malesuada. Nam quis nulla. Integer imperdiet lectus quis justo. Ut tempus purus at lorem.</p>
    <p>Projects:</p>
    <ul>
      <li><a data-item-id="1a3aa6bd-7b4b-486f-86ab-7bfe359ad614" href="###projectlink###">Main projet</a></li>
      <li><a data-item-id="8a7f275d-0e1c-4b30-af3e-f02c91259faf" href="###projectlink###">Sub Broject 1</a></li>
      <li><a data-item-id="91703600-4d43-410e-ba48-93c6c8b0a754" href="###projectlink###">Sub project 2</a></li>
    </ul>
    <p>Aliquam ante. Nam quis nulla. Sed ac dolor sit amet purus malesuada congue. Curabitur vitae diam non enim vestibulum interdum. Phasellus et lorem id felis nonummy placerat. Etiam posuere lacus quis dolor. Nunc tincidunt ante vitae massa. Sed vel lectus. Donec odio tempus molestie, porttitor ut, iaculis quis, sem. Mauris dolor felis, sagittis at, luctus sed, aliquam non, tellus. Etiam sapien elit, consequat eget, tristique non, venenatis quis, ante.</p>`;

    const createNodeMock = jest.fn();
    const actions = {
      actions: {
        createNode: createNodeMock,
      },
      createNodeId: jest.fn(),
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
      .toHaveProperty('elements.content.value', expectedRichTextValue);
    expect(landingPageNode)
      .toHaveProperty('elements.content._html', expectedResolvedRichTextComponent);
  });
});

