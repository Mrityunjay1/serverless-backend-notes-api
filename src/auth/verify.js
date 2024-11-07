const jwt = require("jsonwebtoken");

const generatePolicy = (principalId, effect, resource) => {
  const authResponse = {
    principalId,
  };

  if (effect && resource) {
    authResponse.policyDocument = {
      Version: "2012-10-17",
      Statement: [
        {
          Action: "execute-api:Invoke",
          Effect: effect,
          Resource: resource,
        },
      ],
    };
  }

  return authResponse;
};

module.exports.handler = async (event) => {
  try {
    const token = event.authorizationToken.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    return generatePolicy(decoded.email, "Allow", event.methodArn);
  } catch (error) {
    return generatePolicy("user", "Deny", event.methodArn);
  }
};
