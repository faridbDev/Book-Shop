import User from "../models/User.js";

export const isAdmin = async (req, res, next) => {
  // Find The Logged In User
  const user = await User.findById(req.userAuthId);
  // Check If User Is Admin
  if (user?.isAdmin) {
    next();
  } else {
    next(new Error("اجازه دسترسی به این صفحه را ندارید"));
  }
};