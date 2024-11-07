const jwt = require("jsonwebtoken");

const generatePolicy = (principalId, effect, resource) => {
  const authResponse = {
    principalId,
    context: {
      userId: principalId, // This will be available in event.requestContext.authorizer.userId
    },
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
    // Check for the authorization token
    if (!event.authorizationToken) {
      console.error("No authorization token provided");
      return generatePolicy("unauthorized", "Deny", event.methodArn);
    }

    // Extract the token from the Authorization header
    const token = event.authorizationToken.replace(/^Bearer\s+/, "");

    // Check if the token is empty
    if (!token) {
      console.error("Invalid token format");
      return generatePolicy("unauthorized", "Deny", event.methodArn);
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if the userId is present in the decoded token
    if (!decoded.userId) {
      console.error("Invalid token payload: userId is missing");
      return generatePolicy("unauthorized", "Deny", event.methodArn);
    }

    // Return an Allow policy if everything is valid
    return generatePolicy(decoded.userId, "Allow", event.methodArn);
  } catch (error) {
    console.error("Authorization error:", error.message);
    return generatePolicy("unauthorized", "Deny", event.methodArn);
  }
};
