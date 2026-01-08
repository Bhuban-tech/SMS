// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   /* config options here */
//   reactCompiler: true,
  
// };

// export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    rules: {
      '*.md': {
        loaders: ['raw-loader'],
        as: '*.js',  // Optional but recommended — treats it as a JS module exporting the string
      },
    },
  },
};

module.exports = nextConfig;
