
const normalize = require('../normalize.js');
const contentType = require('./contentType.json');


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

    it(`creates correct structure for the item node`, () => {
      expect(
        normalize.createKcArtifactNode(
          'dummyId',
          contentItemWithoutCycle,
          'item',
          contentItemWithoutCycle.system.codename,
          {
            otherLanguages___NODE: [],
            contentType___NODE: 'dummyContentTypeId',
          }
        )).toMatchSnapshot();
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
