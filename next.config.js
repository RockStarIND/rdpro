const { i18n } = require('./next-i18next.config')

module.exports = {
  env: {
    FAUNA_ADMIN_KEY: process.env.FAUNA_ADMIN_KEY,
    HIDDEN_FOLDERS_RGX: process.env.HIDDEN_FOLDERS_RGX
  },
  i18n,
  reactStrictMode: true,
  // Required by Next i18n with API routes, otherwise API routes 404 when fetching without trailing slash
  trailingSlash: true,
}