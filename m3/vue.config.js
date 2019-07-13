// vue.config.js
const path = require('path')
module.exports = {
    baseUrl : process.env.NODE_ENV === 'production' ? '/static/' : '/',
    configureWebpack: {
        
      // Configuration applied to all builds
      
        resolve: {
            alias: {
                Src: path.resolve(__dirname, './src'),
                Lib: path.resolve(__dirname, './lib'),
                Components: path.resolve(__dirname, './', 'src', 'components'),
                Views: path.resolve(__dirname, '..', 'src', 'views'),
                Course: path.resolve(__dirname, './', 'lib', 'course'),
                Vendor: path.resolve(__dirname, './', 'lib','vendor')
              }
        }
  
    },
    pluginOptions: {
      electronBuilder: {
    
       
      }
    },
    productionSourceMap: false,    //打包好的代码不可以访问源代码
  }