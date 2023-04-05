const path = require('path')
/** @type {import('next').NextConfig} */
const nextConfig = {
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')]
  },
  env: {
    JWT_SECRET_KEY: '9a2d9ee4-2d85-42fd-a102-dc1ba8581166'
  }
}

module.exports = nextConfig
