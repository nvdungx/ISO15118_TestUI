const { VuetifyLoaderPlugin } = require('vuetify-loader')
const { ESLintPlugin } = require('eslint-webpack-plugin')

module.exports = {
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'testui-webpack.bundle.js'
  },
  rules: [
    {
      test: /\.s[ac]ss$/i,
      use: [
        // Creates `style` nodes from JS strings
        'style-loader',
        // Translates CSS into CommonJS
        'css-loader',
        // Compiles Sass to CSS
        'sass-loader'
      ]
    },
    {
      test: /\.js$/,
      exclude: /node_modules/,
      use: {
        loader: "babel-loader"
      }
    },
  ]
}

exports.plugins.push(
  new ESLintPlugin()
)
exports.plugins.push(
  new VuetifyLoaderPlugin()
)
