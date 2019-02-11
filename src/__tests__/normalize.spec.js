
const normalize = require('../normalize.js');
const contentType = require('./contentType.json');
const contentTypeNodes = require('./contentTypeNodes.json');

const contentItemWithCycle = require('./contentItemWithCycle.json');
const contentItemWithoutCycle = require('./contentItemWithoutCycle.json');
describe('normalize.spec.js', () => {
  describe(`createKcArtifactNode with correct arguments`, () => {
    it(`creates correct structure for the type node`, () => {
      expect(
        normalize.createKcArtifactNode(
          'dummyId',
          contentType,
          'type',
          contentType.system.codename,
          {
            contentItems___NODE: [],
          }
        )).toMatchSnapshot();
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
    it('set cycleDetectedProperty and log proper error', () => {
      console.error = jest.fn();
      const expectedLog = `Cycle detected in linked items' path:\
 content_item_1 -> content_item_2 -> content_item_1`;

      expect(
        normalize.parseContentItemContents(contentItemWithCycle)
      ).toMatchSnapshot();
      expect(console.error)
        .toHaveBeenCalledWith(expectedLog);
    });
  });


  describe(
    `parseContentItemContents with a contentItem without a cycle`,
    () => {
      it(`returns a proper item object`, () => {
        expect(
          normalize.parseContentItemContents(contentItemWithoutCycle)
        ).toMatchSnapshot();
      });
    });
});
