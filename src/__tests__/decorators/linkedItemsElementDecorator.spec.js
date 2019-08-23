const _ = require(`lodash`);

const linkedItemsElementDecorator =
  require('../../decorators/linkedItemsElementDecorator');

const contentItemNodesWithLinkedItems =
  require('./contentItemNodesWithLinkedItems.json');

describe('decorateItemNodeWithLinkedItemsLinks', () => {
  it(
    'creates ___NODE property links',
    () => {
      const defaultCultureItems = _.cloneDeep(contentItemNodesWithLinkedItems);

      linkedItemsElementDecorator
        .decorateItemNodesWithLinkedItemsLinks(defaultCultureItems, []);
      defaultCultureItems.forEach((item) =>
        expect(item.elements).toHaveProperty('sub_items'));
      defaultCultureItems.forEach((item) =>
        expect(item.elements.sub_items).toHaveProperty('linked_items___NODE'));
    });
});
