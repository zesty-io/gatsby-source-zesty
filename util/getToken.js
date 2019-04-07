const ZestyAuth = require('zestyio-api-wrapper/auth');

const getToken = async (user, pass) => {
  let token;
  try {
    const zestyAuth = new ZestyAuth();

    token = await zestyAuth.login(user, pass);
  } catch (e) {
    console.log(e);
  }
  return token;
};

export default getToken;
