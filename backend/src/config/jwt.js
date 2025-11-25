module.exports = {
  jwtSecret: process.env.JWT_SECRET,
  jwtExpire: process.env.JWT_EXPIRE || "7d",
  jwtCookieExpire: parseInt(process.env.JWT_COOKIE_EXPIRE || "7", 10),

  // JWT Options
  jwtOptions: {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  },

  // Cookie Options
  getCookieOptions: () => ({
    expires: new Date(
      Date.now() +
        parseInt(process.env.JWT_COOKIE_EXPIRE || "7", 10) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  }),
};
