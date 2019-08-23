
const normalize = require('../normalize.js');
const contentType = require('./contentType.json');

const simpleContentItem = require('./simpleContentItem.json');

describe('normalize.spec.js', () => {
  describe(`createKcArtifactNode with correct arguments`, () => {
    it(`creates correct structure for the type node`, () => {
      const artifact = normalize.createKcArtifactNode(
        'dummyId',
        contentType,
        'type',
        contentType.system.codename,
        {
          contentItems___NODE: [],
        }
      );

      expect(artifact)
        .toHaveProperty('system');
      expect(artifact)
        .toHaveProperty('elements');
      expect(artifact)
        .toHaveProperty('id');
      expect(artifact)
        .toHaveProperty('parent');
      expect(artifact)
        .toHaveProperty('children');
      expect(artifact)
        .toHaveProperty('usedByContentItems___NODE');
      expect(artifact)
        .toHaveProperty('internal.type');
      expect(artifact)
        .toHaveProperty('internal.content');
      expect(artifact)
        .toHaveProperty('internal.contentDigest');
    });

    it(`creates correct structure for the item node`, () => {
      expect(
        normalize.createKcArtifactNode(
          'dummyId',
          simpleContentItem,
          'item',
          simpleContentItem.system.codename,
          {
            otherLanguages___NODE: [],
            contentType___NODE: 'dummyContentTypeId',
          }
        ));
    });
  });
});
