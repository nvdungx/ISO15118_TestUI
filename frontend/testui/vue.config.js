module.exports = {
  transpileDependencies: [
    'vuetify',
    "@koumoul/vjsf"
  ],
  devServer: {
    port: 8081
  },
  configureWebpack: {
    devtool: 'source-map'
  }
}