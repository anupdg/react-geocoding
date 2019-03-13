const HtmlWebPackPlugin = require("html-webpack-plugin");
const webpack = require('webpack');
const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const shouldUseSourceMap = false;
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const FileManagerPlugin = require('filemanager-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = {
  devtool: shouldUseSourceMap,
  entry:{
    app:path.join(process.cwd(), 'app/appmain.js')
  },
  output:{
    pathinfo: true,
    path:path.join(process.cwd(), 'dist'),
    filename: 'static/js/[name]-bunddle-[chunkhash:8].js',
    chunkFilename: 'static/js/chunk-[name]-[chunkhash:8].js',
    publicPath:'/reactmap/',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        options: {
          presets: ['env'],
          plugins: [require('babel-plugin-transform-object-rest-spread')]
        }
      },
      {
        test: /\.css|scss$/,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          { loader: 'css-loader',
            options: {
              importLoaders: 1,
              minimize: true,
              localIdentName: 'static/css/[name].css'
            } 
          },
          {
            loader: 'resolve-url-loader'
          },
          {
            loader: 'sass-loader',
            options: {
                includePaths: [path.join(process.cwd(), 'assets/saas')],
                sourceMap: shouldUseSourceMap
            }
          }
        ]
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg|jpg|gif)$/,
        loader: 'url-loader',
        include: [path.join(process.cwd(), 'assets/css')],
        options: {
                  limit: 1000,
                  name: 'static/css/img/[name]-[hash:8].[ext]'
            }
      },
      {
	    test: /\.(jpg|png|svg|gif)$/,
	    loader: 'file-loader',
	    include: [path.join(process.cwd(), 'assets/images')],
	    options: {
		   //useRelativePath:true,
		   name: 'static/images/[name]-[hash:8].[ext]'
  		}
      }
    ]
  },
  resolve:{
    modules:[
      path.join(process.cwd(), 'app'),
      path.join(process.cwd(), 'node_modules'),
    ],
    extensions: ['.js', '.jsx'],
    alias: {
            components: path.resolve('app/components'),
            utils: path.resolve('app/utils'),
            common: path.resolve('app/components/common'),
            assets: path.resolve('assets')
        }
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
          //sourceMap: true,
          uglifyOptions: {
              ecma: 8,
              warnings: false,
              mangle: {
                safari10: true,
              },
              output: {
                comments: false,
                ascii_only: true,
              },
              toplevel: false,
              nameCache: null,
              ie8: false,
              keep_classnames: undefined,
              keep_fnames: false,
              safari10: false,
          }
      })
    ]
  },
  plugins: [
    new Dotenv({path:'./webpack/prod.env'}),
    new FileManagerPlugin({
			onStart:[
        {delete: [path.join(process.cwd(), 'dist/*')]},
        {copy: [
				        { source: path.join(process.cwd(), 'public'), destination: path.join(process.cwd(), 'dist') }
				      ]}
      ],
      oEnd:[
        {delete: [path.join(process.cwd(), 'dist/data')]}
      ]
		}),
    new HtmlWebPackPlugin({
      inject: true,
      template: path.join(process.cwd(), "public/index.html"),
      chunksSortMode: 'none',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
    }),
    new MiniCssExtractPlugin({
      filename: 'static/css/[name]-[contenthash:8].css',
      chunkFilename: 'static/css/chunk-[id]-[hash:8].css',
    })
  ]
};