const _ = require(`lodash`);

const linkedItemsElementDecorator =
  require('../../decorators/linkedItemsElementDecorator');

const contentItemNodesWithLinkedItems =
  require('./contentItemNodesWithLinkedItems.json');

describe('decorateItemNodeWithLinkedItemsLinks', () => {
  it(
    'remove linked items element property and creates ___NODE ones',
    () => {
      const defaultCultureItems = _.cloneDeep(contentItemNodesWithLinkedItems);

      linkedItemsElementDecorator
        .decorateItemNodesWithLinkedItemsLinks(defaultCultureItems, []);

      defaultCultureItems.forEach((item) =>
        expect(item.elements).not.toHaveProperty('sub_items'));
      defaultCultureItems.forEach((item) =>
        expect(item.elements).toHaveProperty('sub_items___NODE'));
    });
});
