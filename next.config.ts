// Bu dosya Next.js projesinin ana yapılandırma dosyasıdır
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['api.pcpartpicker.com', 'cdn.benchmark.pl', 'images.nvidia.com', 'www.amd.com'],
  },
  i18n: {
    locales: ['tr', 'en'],
    defaultLocale: 'tr',
  },
};

module.exports = nextConfig;