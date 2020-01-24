
const normalize = require('../normalize.js');
const contentType = require('./contentType.json');
const { createItemRawContent } = require('../itemNodes');

const simpleContentItem = require('./simpleContentItem.json');

describe('normalize.spec.js', () => {
  describe(`createKontentArtifactNode with correct arguments`, () => {
    const checkArtifactStructure = (artifact) => {
      expect(artifact)
        .toHaveProperty('system');
      expect(artifact)
        .toHaveProperty('elements');
      expect(artifact)
        .toHaveProperty('id', `dummyId`);
      expect(artifact)
        .toHaveProperty('parent');
      expect(artifact)
        .toHaveProperty('children');
      expect(artifact)
        .toHaveProperty('usedByContentItems___NODE');
      expect(artifact)
        .toHaveProperty('internal.type');
      expect(artifact)
        .toHaveProperty('internal.contentDigest');
    };

    it(`creates correct structure for the type node`, () => {
      const artifact = normalize.createKontentArtifactNode(
        'dummyId',
        contentType,
        'type',
        contentType.system.codename,
        {
          contentItems___NODE: [],
        },
        false,
        contentType
      );

      checkArtifactStructure(artifact);
      expect(artifact)
        .not
        .toHaveProperty('internal.content');
    });

    it(`creates correct structure for the type node with content`, () => {
      const artifact = normalize.createKontentArtifactNode(
        'dummyId',
        contentType,
        'type',
        contentType.system.codename,
        {
          contentItems___NODE: [],
        },
        true,
        contentType
      );

      checkArtifactStructure(artifact);
      expect(artifact)
        .toHaveProperty('internal.content');
    });

    it(`creates correct structure for the item node`, () => {
      const artifact = normalize.createKontentArtifactNode(
        'dummyId',
        simpleContentItem,
        'item',
        simpleContentItem.system.codename,
        {
          otherLanguages___NODE: [],
          contentType___NODE: 'dummyContentTypeId',
        },
        false,
        createItemRawContent(
          simpleContentItem.system,
          simpleContentItem.elements,
          'dummy_language'
        )
      );

      checkArtifactStructure(artifact);
      expect(artifact)
        .not
        .toHaveProperty('internal.content');
    });

    it(`creates correct structure for the item node with content`, () => {
      const artifact = normalize.createKontentArtifactNode(
        'dummyId',
        simpleContentItem,
        'item',
        simpleContentItem.system.codename,
        {
          otherLanguages___NODE: [],
          contentType___NODE: 'dummyContentTypeId',
        },
        true,
        createItemRawContent(
          simpleContentItem.system,
          simpleContentItem.elements,
          'dummy_language'
        ),
      );

      checkArtifactStructure(artifact);
      expect(artifact)
        .toHaveProperty('internal.content');
    });
  });
});
