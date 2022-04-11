const getPortalUrl = require('../controllers/stripe/get-portal-url');

exports.handler = async function (event) {
  return await getPortalUrl(event);
}
