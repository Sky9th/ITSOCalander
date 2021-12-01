// vue.config.js
const resolve = require('path').resolve

module.exports = {
    publicPath: '/',
    configureWebpack: {
        plugins: [
        ],
        resolve: {
            alias: {
                '~': resolve(__dirname, 'src'),
                '@src': resolve(__dirname, 'src')
            },
            extensions: ['.js', '.vue', '.json', '.css']
        },
    }
}