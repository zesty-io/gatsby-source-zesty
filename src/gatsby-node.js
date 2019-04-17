const SDK = require('@zesty-io/sdk');

exports.sourceNodes = async (
  { actions, createNodeId, createContentDigest },
  configOptions
) => {
  const { createNode } = actions;
  const { userName, password, instanceZUID } = configOptions;

  if (!userName || !password || !instanceZUID) {
    console.error(
      'Username, Password, and instance ZUID are required for Zesty.io source plugin'
    );
    return;
  }

  const handleGenerateNodes = (node, name, ZUID) => {
    return {
      ...node,
      id: createNodeId(ZUID),
      parent: null,
      children: [],
      internal: {
        type: name,
        content: JSON.stringify(node),
        contentDigest: createContentDigest(node),
      },
    };
  };

  // authenticate session
  async function authedSDK() {
    const auth = new SDK.Auth();
    const session = await auth.login(userName, password);
    return new SDK(instanceZUID, session.token);
  }

  const zesty = await authedSDK();

  const { models, items } = configOptions;
  // by default all models and items are fetched
  if (!models && !items) {
    zesty.instance.getModels().then(modelRes => {
      const contentModels = modelRes.data;
      contentModels.map(model => {
        return zesty.instance.getItems(model.ZUID).then(itemRes => {
          const contentModelItems = itemRes.data;
          contentModelItems.map(item => {
            return createNode(
              handleGenerateNodes(item, model.label, item.meta.ZUID)
            );
          });
        });
      });
    });
  } else {
    // the user has specified models/items to fetch
    if (models) {
      models.map(model => {
        return zesty.instance.getItems(model.ZUID).then(itemRes => {
          const userModelItems = itemRes.data;
          userModelItems.map(item => {
            return createNode(
              handleGenerateNodes(item, model.label, item.meta.ZUID)
            );
          });
        });
      });
    }
    if (items) {
      items.map(item => {
        return zesty.instance.getItem(item).then(res => {
          const userItem = res.data;
          return createNode(
            handleGenerateNodes(
              userItem,
              userItem.web.metaTitle,
              userItem.meta.ZUID
            )
          );
        });
      });
    }
  }
};
