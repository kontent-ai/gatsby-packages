const deliveryClient = require(`kentico-cloud-delivery`);
const normalize = require(`./normalize`);

exports.sourceNodes =
  async ({actions, createNodeId}, {kcProjectId, kcLanguageCodenames}) => {
    console.info(`The 'sourceNodes' API call started.`);
    const {createNode} = actions;

    const client = new deliveryClient.DeliveryClient({
      projectId: kcProjectId,
    });

    const contentTypesResponse = await client.types().getPromise();

    let contentTypeNodes = contentTypesResponse.types.map((contentType) =>
      normalize.createContentTypeNode(createNodeId, contentType)
    );

    const contentItemsResponse = await client.items().getPromise();
    const contentItems = contentItemsResponse.items;

    normalize.refillRichTextModularCodenames(
        contentItems, contentItemsResponse.debug.response.data.items
    );

    let defaultLanguageCodename = `default`;

    if (contentItemsResponse.items &&
      Array.isArray(contentItemsResponse) &&
      contentItemsResponse.items.length > 0) {
      defaultLanguageCodename = contentItemsResponse.items[0].system.language;
    }

    let contentItemNodes = contentItemsResponse.items.map((contentItem) =>
      normalize.createContentItemNode(
          createNodeId, contentItem, contentTypeNodes
      )
    );

    let nonDefaultLanguagePromises = kcLanguageCodenames
        .filter((languageCodename) => {
          languageCodename !== defaultLanguageCodename;
        })
        .map((languageCodename) =>
          client.items().languageParameter(languageCodename).getPromise());

    const languageResponses = await Promise.all(nonDefaultLanguagePromises);
    let nonDefaultLanguageItemNodes = new Map();

    languageResponses.forEach((languageResponse) => {
      const languageItems = languageResponse.items;

      normalize.refillRichTextModularCodenames(
          languageItems, languageResponse.debug.response.data.items
      );

      let allNodesOfCurrentLanguage = [];
      let languageCodename = null;

      contentItemNodes.forEach((contentItemNode) => {
        const languageVariantItem = languageItems.find((variant) =>
          contentItemNode.system.codename === variant.system.codename);

        if (languageVariantItem !== undefined && languageVariantItem !== null) {
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

      if (languageCodename !== null) {
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
      normalize.decorateItemNodesWithModularElementLinks(
          itemNode, contentItemNodes
      );
    });

    nonDefaultLanguageItemNodes.forEach((languageNodes) => {
      languageNodes.forEach((itemNode) => {
        normalize.decorateItemNodesWithModularElementLinks(
            itemNode, languageNodes
        );
      });
    });

    contentItemNodes.forEach((itemNode) => {
      normalize.decorateItemNodesWithRichTextModularLinks(
          itemNode, contentItemNodes);
    });

    nonDefaultLanguageItemNodes.forEach((languageNodes) => {
      languageNodes.forEach((itemNode) => {
        normalize.decorateItemNodesWithRichTextModularLinks(
            itemNode, languageNodes
        );
      });
    });

    try {
      contentTypeNodes.forEach(
          (contentTypeNode) => createNode(contentTypeNode)
      );
    } catch (error) {
      console.log(`Error when creating content type nodes. Details: ${error}`);
    }

    try {
      contentItemNodes.forEach(
          (contentItemNode) => createNode(contentItemNode)
      );
    } catch (error) {
      console.log(`Error when creating content item nodes. Details: ${error}`);
    }

    nonDefaultLanguageItemNodes.forEach((languageNodes) => {
      languageNodes.forEach((itemNode) => {
        try {
          createNode(itemNode);
        } catch (error) {
          console.log(
              `Error when creating language variant nodes. Details: ${error}`
          );
        }
      });
    });

    console.info(`The 'sourceNodes' API call finished.`);
    return;
  };
