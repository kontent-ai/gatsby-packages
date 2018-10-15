
const normalize = require('../normalize');
const contentType = require('./contentType.json');
const contentTypeNodes = require('./contentTypeNodes.json');
const contentItem = require('./contentItem.json');
// const contentItemNodes = require('./contentItemNodes');

describe('createContentTypeNode with correct arguments', () => {
  it(`creates a content type node`, () => {
    const createNodeId = jest.fn();
    createNodeId.mockReturnValue(`aea6da0c-4130-593c-8b6e-006e6bace1de`);

    expect(
        normalize.createContentTypeNode(createNodeId, contentType)
    ).toMatchSnapshot();
  });
});

describe('createContentItemNode with correct arguments', () => {
  it(`creates a content item node`, () => {
    const createNodeId = jest.fn();
    createNodeId.mockReturnValue(`362bd0da-5b1a-533b-9575-107c2e3c6931`);

    expect(
        normalize.createContentItemNode(
            createNodeId, contentItem, contentTypeNodes
        )
    ).toMatchSnapshot();
  });
});
