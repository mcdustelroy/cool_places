 const path = require('path');
//  const HtmlWebpackPlugin = require('html-webpack-plugin');
 
 module.exports = {
   entry: {
     index: './app.js'
   },
   output: {
    //  filename: '[name].bundle.js',
     filename: '[name].js',
     path: path.resolve(__dirname, 'dev-build'),
     clean: true,
   },
   mode: 'development',
   target: 'node',
   module: {
    rules: [
        {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader'
        }
    ]
   }
 };