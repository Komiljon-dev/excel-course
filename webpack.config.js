const path = require('path')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const isProd = process.env.NODE_ENV === 'production'
const isDev = !isProd

const filename = ext => isDev ? `bundle.${ext}` : `bundle.[hash].${ext}`
const jsLoaders = () => {
   const loaders = [
      {
         loader: "babel-loader",
         options: {
            presets: ['@babel/preset-env']
         }
      },
   ]

   if (isDev) {
      loaders.push('eslint-loader')
   }

   return loaders
}

console.log('prod', isProd);
console.log('dev', isDev);
module.exports = {
   context: path.resolve(__dirname, 'src'),
   mode: 'development',
   entry: './index.js',
   resolve: {
      extensions: ['.js', '.json',],
      alias: {
         "@": path.resolve(__dirname, 'src'),
         "@core": path.resolve(__dirname, 'scr/core')
      }
   },
   output: {
      filename: filename('js'),
      path: path.resolve(__dirname, 'dist')
   },
   devtool: isDev ? 'source-map' : false,
   devServer: {
      port: 4000,
      hot: isDev,
   },
   plugins: [
      new CleanWebpackPlugin(),
      new HTMLWebpackPlugin({
         template: 'index.html',
         minify: {
            removeComments: isProd,
            collapseWhitespace: isProd,
         }
      }),
      new CopyPlugin({
         patterns: [
            {
               from: path.resolve(__dirname, 'src/favicon.ico'),
               to: path.resolve(__dirname, 'dist'),
            },
         ],
      }),
      new MiniCssExtractPlugin({
         filename: filename('css'),
      }),
   ],
   module: {
      rules: [
         {
            test: /\.s[ac]ss$/i,
            use: [
               MiniCssExtractPlugin.loader,
               "css-loader",
               "sass-loader",
            ],
         },
         {
            test: /\.js$/,
            exclude: /node_modules/,
            use: jsLoaders(),
         }
      ],
   }
}