const {
  override,
  addDecoratorsLegacy,
  addBabelPlugin,
} = require("customize-cra");

module.exports = override(
  addBabelPlugin([
    "babel-plugin-root-import",
    {
      rootPathSuffix: "src",
    },
  ]),
  addDecoratorsLegacy()
);
