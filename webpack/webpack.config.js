const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const Dotenv = require('dotenv-webpack');
var path = require('path');

module.exports = {
    devtool: 'source-map',
    entry: {
        app: path.join(process.cwd(), 'app/appmain.js')
      },
    output: {        
        // path: __dirname + '/dist',
        path: path.resolve(process.cwd(), 'dist'),
        filename: 'static/js/appbundle.js',
        chunkFilename: 'static/js/chunk-[name].js',
        publicPath:'/',
    },
    devServer: {
        contentBase: path.join(process.cwd(), 'public'),
        port:3001,
        historyApiFallback: true
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
                test: /\.css|.scss$/,
                use: [
                  { loader: MiniCssExtractPlugin.loader },
                  { loader: 'css-loader',
                    options: {
                      importLoaders: 1,
                      minimize: false,
                      //localIdentName: 'static/css/[name].css'
                    } 
                  },
                  {
                    loader: 'resolve-url-loader'
                  },
                  {
                    loader: 'sass-loader',
                    options: {
                        includePaths: [path.join(process.cwd(), 'assets/saas')],
                        sourceMap: true
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
                          name: 'static/images/[name].[ext]'
                    }
            },
            {
                test: /\.(jpg|png|svg|gif)$/,
                loader: 'file-loader',
                include: [path.join(process.cwd(), 'assets/images')],
                options: {
                  //useRelativePath:true,
                  name: 'static/images/[name].[ext]'
                }
            }
        ],
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
    
    plugins: [
        new Dotenv({path:'./webpack/test.env'}),
        new HtmlWebPackPlugin({
            title: 'CustomTitle',
            template: 'public/index.html', // Load a custom template
            inject: true,
            chunksSortMode: 'none',
        }),
        new MiniCssExtractPlugin({
            filename: 'static/css/[name].css',// : '[name].[hash].css',
            chunkFilename: 'static/css/chunk-[id].css'// : '[id].[hash].css',
        })
    ]

}