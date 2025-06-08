const CracoLessPlugin = require("craco-less");
const path = require("path");

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              // Variables globales de Spotify
              "@primary-color": "#1db954",
              "@secondary-color": "#1ed760",
              "@background-color": "#121212",
              "@surface-color": "#181818",
              "@card-color": "#282828",
              "@text-primary": "#ffffff",
              "@text-secondary": "#b3b3b3",
              "@text-muted": "#535353",
              "@border-color": "#393939",
              "@hover-color": "#1a1a1a",
              "@success-color": "#1db954",
              "@warning-color": "#ffa500",
              "@error-color": "#e22134",

              // Espaciado
              "@spacing-xs": "4px",
              "@spacing-sm": "8px",
              "@spacing-md": "16px",
              "@spacing-lg": "24px",
              "@spacing-xl": "32px",
              "@spacing-xxl": "48px",

              // Tipografía
              "@font-family":
                "'Circular', 'Helvetica Neue', Helvetica, Arial, sans-serif",
              "@font-size-xs": "11px",
              "@font-size-sm": "12px",
              "@font-size-md": "14px",
              "@font-size-lg": "16px",
              "@font-size-xl": "24px",
              "@font-size-xxl": "32px",
              "@font-size-xxxl": "48px",

              // Bordes y radianes
              "@border-radius-sm": "4px",
              "@border-radius-md": "8px",
              "@border-radius-lg": "16px",
              "@border-radius-xl": "24px",
              "@border-radius-round": "50%",

              // Sombras
              "@shadow-sm": "0 2px 4px rgba(0, 0, 0, 0.1)",
              "@shadow-md": "0 4px 8px rgba(0, 0, 0, 0.15)",
              "@shadow-lg": "0 8px 16px rgba(0, 0, 0, 0.2)",
              "@shadow-xl": "0 16px 32px rgba(0, 0, 0, 0.25)",

              // Transiciones
              "@transition-fast": "0.1s ease",
              "@transition-normal": "0.2s ease",
              "@transition-slow": "0.3s ease",

              // Z-index
              "@z-index-dropdown": "1000",
              "@z-index-modal": "1050",
              "@z-index-tooltip": "1070",
              "@z-index-player": "100",
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],

  // Configuración simplificada de webpack
  webpack: {
    alias: {
      // Solo alias esenciales para evitar conflictos
      "@": path.resolve(__dirname, "src"),
      "@components": path.resolve(__dirname, "src/components"),
      "@styles": path.resolve(__dirname, "src/styles"),
      "@utils": path.resolve(__dirname, "src/utils"),
      "@hooks": path.resolve(__dirname, "src/hooks"),
      "@data": path.resolve(__dirname, "src/data"),
      // Removemos @types para evitar conflicto con TypeScript
    },
  },
};
