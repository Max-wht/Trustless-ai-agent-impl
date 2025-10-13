/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: false,
    tsconfigPath: './tsconfig.json',
  },
  transpilePackages: ['@trustless/shared'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'ipfs.io' },
      { protocol: 'https', hostname: 'gateway.pinata.cloud' },
      { protocol: 'https', hostname: 'cloudflare-ipfs.com' },
    ],
  },
  webpack: (config, { isServer }) => {
    // Fix for Web3/WalletConnect dependencies
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }

    // Ignore warnings for optional dependencies
    config.ignoreWarnings = [
      { module: /node_modules\/@react-native-async-storage\/async-storage/ },
      { module: /node_modules\/pino-pretty/ },
    ];

    // Externalize problematic modules on server side
    if (isServer) {
      config.externals.push({
        'utf-8-validate': 'commonjs utf-8-validate',
        'bufferutil': 'commonjs bufferutil',
      });
    }

    return config;
  },
};

module.exports = nextConfig;

