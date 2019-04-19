const SDK = require('@zesty-io/sdk');

exports.sourceNodes = async (
  { actions, createNodeId, createContentDigest },
  configOptions
) => {
  const { createNode } = actions;
  const { email, password, instanceZUID } = configOptions;

  if (!email || !password || !instanceZUID) {
    console.error(
      'Email, Password, and Instance ZUID are required for Zesty.io source plugin'
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
        type: name.replace(/-|__|:|\.|\s/g, `_`),
        content: JSON.stringify(node),
        contentDigest: createContentDigest(node),
      },
    };
  };

  // authenticate session
  const auth = new SDK.Auth();
  const session = await auth.login(email, password);
  console.log('\n Authenticating Zesty instance');
  const zesty = new SDK(instanceZUID, session.token);

  console.log('\n Fetching Zesty data');
  // by default all models and items are fetched
  const modelRes = await zesty.instance.getModels();
  const contentModels = modelRes.data;
  const contentModelItems = await Promise.all(
    contentModels.map(model =>
      zesty.instance.getItems(model.ZUID).then(itemRes => itemRes.data)
    )
  );

  // eslint-disable-next-line consistent-return
  return contentModelItems.map((items, i) =>
    items.map(item =>
      createNode(
        handleGenerateNodes(
          item,
          contentModels[i].label || 'ZestyContent',
          item.meta.ZUID
        )
      )
    )
  );
};
