
const normalize = require('../normalize');
const contentType = require('./data/simpleContentType.json');
const contentTypeNodes = require('./data/simpleContentTypeNodes.json');
const contentItem = require('./data/simpleContentItem.json');

const linkedContentItem =
  require('./data/linkedContentItem.json');
const circularDependencyTypeNodes =
  require('./data/linkedContentTypeNodes.json');

describe('createContentTypeNode with correct arguments', () => {
  it(`creates a content type node`, () => {
    const createNodeId = jest.fn();
    createNodeId.mockReturnValue(`aea6da0c-4130-593c-8b6e-006e6bace1de`);

    expect(
      normalize.createContentTypeNode(createNodeId, contentType)
    ).toMatchSnapshot();
  });
});

describe('createContentItemNode', () => {
  it(`with correct arguments creates a content item node`, () => {
    const createNodeId = jest.fn();
    createNodeId.mockReturnValue(`362bd0da-5b1a-533b-9575-107c2e3c6931`);

    expect(
      normalize.createContentItemNode(
        createNodeId, contentItem, contentTypeNodes
      )
    ).toMatchSnapshot();
  });

  const addSelfCircularDependency = (contentItem, elementName) => {
    const contentItemCodename = contentItem.system.codename;

    contentItem
      .elements[elementName]
      .value
      .push(contentItemCodename);

    contentItem[elementName]
      .push(contentItem);
    return contentItem;
  };

  it('detects circular reference', () => {
    const createNodeId = jest.fn();
    createNodeId.mockReturnValue(`362bd0da-5b1a-533b-9575-107c2e3c6931`);

    const item = addSelfCircularDependency(
      linkedContentItem, 'related_projects');

    expect(
      () => normalize.createContentItemNode(
        createNodeId, item, circularDependencyTypeNodes
      )
    ).toThrowError('Cycle detected in linked items\' path');
  });
});


