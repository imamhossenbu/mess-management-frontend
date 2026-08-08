// postcss.config.mjs
const config = {
  plugins: {
    "@tailwindcss/postcss": {
      // Disable optimization for now
      optimize: false,
      // Add sources config
      sources: {
        include: [
          "./src/**/*.{js,jsx,ts,tsx,mdx}",
          "./app/**/*.{js,jsx,ts,tsx,mdx}",
        ],
      },
    },
  },
};

export default config;
