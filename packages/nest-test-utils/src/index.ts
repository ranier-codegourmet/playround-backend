import * as jwt from "jsonwebtoken";

export const generateJwt = (claims: Record<string, any>) => {
  return jwt.sign(claims, process.env.AUTH_PRIVATE_KEY, {
    algorithm: "RS256",
  });
};
