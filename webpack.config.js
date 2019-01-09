const routes = require('./routes.js');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const entry = routes.reduce((acc, { name, js }) => {
  acc[name] = path.resolve(__dirname, js);
  return acc;
}, {});

const htmls = routes.map(route => {
  return new HtmlWebpackPlugin({
    filename : route.path,
    template : route.template,
    chunks : [route.name]
  });
});
htmls.push(new HtmlWebpackPlugin({
  filename : 'index.html',
  template : path.resolve(__dirname, './src/components/index.hbs'),
  inject : false,
  routes
}));

module.exports = {
  entry : entry,
  output: {
    filename: '[name].js',
    path: __dirname + '/dist'
  },
  mode : 'development',
  devtool: 'inline-source-map',
  module : {
    rules : [
      {
        test: /\.jsx?/i,
        exclude: /node_modules/,
        use: [
          {
            loader :'babel-loader',
            options : {
              presets : [
                ['@babel/preset-env']
              ]
            }
          }
        ]
      },
      {
        test: /\.hbs$/,
        loader: "handlebars-loader"
      },
      {
        test: /\.s?css$/,
        use : [
          {
            loader : 'style-loader',
            options : {
              singleton : true
            }
          },
          {
            loader : 'css-loader',
            options : {
              modules : true
            }
          },
          {
            loader : 'sass-loader'
          },
          {
            loader : 'postcss-loader'
          }
        ]
      }
    ]
  },
  devtool : 'source-map',
  plugins : [
    ...htmls
  ],
  devServer : {
    contentBase : path.join(__dirname, 'dist'),
    compress : true,
    historyApiFallback : true
  }
};
