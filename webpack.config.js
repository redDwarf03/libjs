const path = require('path');
module.exports = {
    entry: './index.js',
    output: {
      filename: 'index.js',
      path: path.resolve(__dirname, 'dist'),
      library: "ArchEthic",
      libraryTarget: "umd"
    },
    devtool: 'source-map'
}
