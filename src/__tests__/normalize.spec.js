
const normalize = require('../normalize.js');
const contentType = require('./contentType.json');
const contentTypeNodes = require('./contentTypeNodes.json');

const contentItemWithCycle = require('./contentItemWithCycle.json');
const contentItemWithoutCycle = require('./contentItemWithoutCycle.json');

describe(`createContentTypeNode with correct arguments`, () => {
  it(`creates a content type node`, () => {
    const createNodeId = jest.fn();
    createNodeId.mockReturnValue(`aea6da0c-4130-593c-8b6e-006e6bace1de`);

    expect(
        normalize.createContentTypeNode(createNodeId, contentType)
    ).toMatchSnapshot();
  });
});

describe(`createContentItemNode with correct arguments`, () => {
  it(`creates a content item node`, () => {
    const createNodeId = jest.fn();
    createNodeId.mockReturnValue(`362bd0da-5b1a-533b-9575-107c2e3c6931`);

    expect(
        normalize.createContentItemNode(
            createNodeId, contentItemWithoutCycle, contentTypeNodes
        )
    ).toMatchSnapshot();
  });
});

describe(`parseContentItemContents with a contentItem with a cycle`, () => {
  it(`throws`, () => {
    expect(() => {
      normalize.parseContentItemContents(contentItemWithCycle);
    }).toThrow(`Cycle detected in linked items' path:`);
  });
});

describe(`parseContentItemContents with a contentItem without a cycle`, () => {
  it(`returns a proper item object`, () => {
    expect(
        normalize.parseContentItemContents(contentItemWithoutCycle)
    ).toMatchSnapshot();
  });
});
