require(`@babel/polyfill`);
const _ = require(`lodash`);
const deliveryClient = require(`kentico-cloud-delivery`);
const normalize = require(`./normalize`);

exports.sourceNodes =
  async ({actions, createNodeId},
    {deliveryClientConfig, languageCodenames}) => {
    console.info(`The 'sourceNodes' API implementation starts.
projectId: ${deliveryClientConfig.projectId}, languageCodenames: ${languageCodenames}.`);

    const {createNode} = actions;
    const client = new deliveryClient.DeliveryClient(deliveryClientConfig);
    const contentTypesResponse = await client.types().getPromise();

    let contentTypeNodes = contentTypesResponse.debug.response.data.types.map(
        (contentType) =>
          normalize.createContentTypeNode(createNodeId, contentType)
    );

    const contentItemsResponse = await client.items().getPromise();

    let defaultLanguageCodename = `default`;

    if (_.has(contentItemsResponse, `items[0].system.language`)
        && _.isString(contentItemsResponse.items[0].system.language)) {
      defaultLanguageCodename = contentItemsResponse.items[0].system.language;
    }

    let contentItemNodes = contentItemsResponse.debug.response.data.items.map(
        (contentItem) =>
          normalize.createContentItemNode(
              createNodeId, contentItem, contentTypeNodes
          )
    );

    let nonDefaultLanguagePromises = languageCodenames
        .filter((languageCodename) =>
          languageCodename !== defaultLanguageCodename
        )
        .map((languageCodename) =>
          client.items().languageParameter(languageCodename).getPromise()
        );

    const languageResponses = await Promise.all(nonDefaultLanguagePromises);
    let nonDefaultLanguageItemNodes = new Map();

    languageResponses.forEach((languageResponse) => {
      const languageItems = languageResponse.debug.response.data.items;

      let allNodesOfCurrentLanguage = [];
      let languageCodename = null;

      contentItemNodes.forEach((contentItemNode) => {
        const languageVariantItem = languageItems.find((variant) =>
          contentItemNode.system.codename === variant.system.codename);

        if (_.isString(languageVariantItem.system.language)) {
          languageCodename = languageVariantItem.system.language;

          const languageVariantNode =
              normalize.createContentItemNode(
                  createNodeId, languageVariantItem, contentTypeNodes
              );

          normalize.decorateItemNodeWithLanguageVariantLink(
              languageVariantNode, contentItemNodes
          );

          allNodesOfCurrentLanguage.push(languageVariantNode);
        }
      });

      if (_.isString(languageCodename)) {
        nonDefaultLanguageItemNodes.set(
            languageCodename, allNodesOfCurrentLanguage
        );
      }
    });

    for (let [languageCodename, currentLanguageNodes]
      of nonDefaultLanguageItemNodes) {
      contentItemNodes.forEach((contentItemNode) => {
        normalize.decorateItemNodeWithLanguageVariantLink(
            contentItemNode, currentLanguageNodes
        );
      });

      for (let [otherLanguageCodename, otherLanguageNodes]
        of nonDefaultLanguageItemNodes) {
        if (otherLanguageCodename !== languageCodename) {
          currentLanguageNodes.forEach((contentItemNode) => {
            normalize.decorateItemNodeWithLanguageVariantLink(
                contentItemNode, otherLanguageNodes
            );

            normalize.decorateItemNodeWithLanguageVariantLink(
                contentItemNode, contentItemNodes
            );
          });
        }
      }

      normalize.decorateTypeNodesWithItemLinks(
          currentLanguageNodes, contentTypeNodes
      );
    }

    normalize.decorateTypeNodesWithItemLinks(
        contentItemNodes, contentTypeNodes
    );

    contentItemNodes.forEach((itemNode) => {
      normalize.decorateItemNodeWithModularElementLinks(
          itemNode, contentItemNodes
      );
    });

    nonDefaultLanguageItemNodes.forEach((languageNodes) => {
      languageNodes.forEach((itemNode) => {
        normalize.decorateItemNodeWithModularElementLinks(
            itemNode, languageNodes
        );
      });
    });

    contentItemNodes.forEach((itemNode) => {
      normalize.decorateItemNodeWithRichTextModularLinks(
          itemNode, contentItemNodes);
    });

    nonDefaultLanguageItemNodes.forEach((languageNodes) => {
      languageNodes.forEach((itemNode) => {
        normalize.decorateItemNodeWithRichTextModularLinks(
            itemNode, languageNodes
        );
      });
    });

    try {
      contentTypeNodes.forEach(
          (contentTypeNode) => {
            console.info(
                `The 'createNode' API is called.
contentTypeNode.id: ${contentTypeNode.id}`
            );

            createNode(contentTypeNode);
          }
      );
    } catch (error) {
      console.error(
          `Error when creating content type nodes. Details: ${error}`
      );
    }

    console.info(`The 'createNode' API is called for content item nodes.`);
    try {
      contentItemNodes.forEach(
          (contentItemNode) => {
            console.info(
                `The 'createNode' API is called.
contentItemNode.id: ${contentItemNode.id}`
            );

            createNode(contentItemNode);
          }
      );
    } catch (error) {
      console.error(
          `Error when creating content item nodes. Details: ${error}`
      );
    }

    nonDefaultLanguageItemNodes.forEach((languageNodes) => {
      languageNodes.forEach((languageVariantNode) => {
        try {
          createNode(languageVariantNode);

          console.info(
              `The 'createNode' API is called.
languageVariantNode.id: ${languageVariantNode.id}`
          );
        } catch (error) {
          console.error(
              `Error when creating language variant nodes. Details: ${error}`
          );
        }
      });
    });

    console.info(`The 'sourceNodes' API implementation exits.`);
    return;
  };
