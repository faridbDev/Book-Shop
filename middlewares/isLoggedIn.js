import { getTokenFromHeader } from "../utils/getTokenFromHeader.js";
import { verifyToken } from "../utils/verifyToken.js";

export const isLoggedIn = (req, res, next) => {
  // Get Token From Header
  const token = getTokenFromHeader(req);
  // Verify The Token
  const decodedUser = verifyToken(token);
  if (!decodedUser) {
    throw new Error("لطفا دوباره وارد شوید");
  } else {
    // Save The User Into req obj
    req.userAuthId = decodedUser?.userId;
    next();
  }
};