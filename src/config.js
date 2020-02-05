module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    // DATABASE_URL: process.env.DATABASE_URL || "postgres://bookmaster:default@localhost/musicbooks",
    DATABASE_URL: "postgres://bookmaster:default@localhost/musicbooks",
    JWT_SECRET: process.env.JWT_SECRET || 'absolutely-change-this'
  }