
const normalize = require('../normalize.js');
const contentType = require('./contentType.json');
const contentTypeNodes = require('./contentTypeNodes.json');
// const contentItemNodes = require('./contentItemNodes');
const arrayToSort = require('./arrayToSort.json');
const arrayToSortBy = require('./arrayToSortBy.json');
const arrayToSortWithRedundantElements =
  require('./arrayToSortWithRedundantElements.json');
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

describe(`sortArrayByAnotherOne with a non-array object 
as the arraytoSort argument`, () => {
  it(`throws if arrayToSort is not an array`, () => {
    expect(() => {
      normalize.sortArrayByAnotherOne(
          contentType, arrayToSortBy
      );
    }).toThrow(`Cannot sort a non-array object.`);
  });
});

describe(`sortArrayByAnotherOne with a non-array object 
as the arraytoSortBy argument`, () => {
  it(`throws if arrayToSortBy is not an array`, () => {
    expect(() => {
      normalize.sortArrayByAnotherOne(
          arrayToSort, contentType
      );
    }).toThrow(`Cannot sort a non-array object.`);
  });
});

describe(`sortArrayByAnotherOne with the arrayToSort argument 
containing elements that are not present in arrayToSortBy`, () => {
  it(`throws`, () => {
    expect(() => {
      normalize.sortArrayByAnotherOne(
          arrayToSortWithRedundantElements, arrayToSortBy
      );
    }).toThrow(`There are elements of arrayToSort 
that are not present in arrayToSortBy.`);
  });
});

describe(`sortArrayByAnotherOne with correct arguments`, () => {
  it(`sorts arrayToSort according to arrayToSortBy`, () => {
    expect(
        normalize.sortArrayByAnotherOne(
            arrayToSort, arrayToSortBy
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
