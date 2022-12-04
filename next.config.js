const { faDigitalOcean } = require('@fortawesome/free-brands-svg-icons')
const { i18n } = require('./next-i18next.config')

module.exports = {
  env: {
    FAUNA_ADMIN_KEY: process.env.FAUNA_ADMIN_KEY,
    HIDDEN_FOLDERS_RGX: process.env.HIDDEN_FOLDERS_RGX
  },
  images: {
    domains: ['southindia1-mediap.svc.ms', 'res.cloudinary.com', '*', 'icons.iconarchive.com', 'icon-library.com', 'i.pinimg.com', 'play-lh.googleusercontent.com', 'icons.iconarchive.com', 'play-lh.googleusercontent.com', 'img.utdstc.com', 'alliancex.org', 'cdn-icons-png.flaticon.com', 'alliancex.org', 'icons.iconarchive.com', 'cdn-icons-png.flaticon.com', 'img.icons8.com'],
  },
  i18n,
  reactStrictMode: true,
  // Required by Next i18n with API routes, otherwise API routes 404 when fetching without trailing slash
  trailingSlash: true,
}