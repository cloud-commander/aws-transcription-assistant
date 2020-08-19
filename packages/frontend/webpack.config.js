// based on https://itnext.io/how-to-package-your-react-component-for-distribution-via-npm-d32d4bf71b4f
// and http://jasonwatmore.com/post/2018/04/14/react-npm-how-to-publish-a-react-component-to-npm
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const isDevelopment = process.env.NODE_ENV !== 'production';
const nodeExternals = require('webpack-node-externals');
const { CheckerPlugin } = require('awesome-typescript-loader');

module.exports = {
  mode: 'production',
  devtool: 'source-map',
  entry: {
    index: './src/index.tsx',
    TranscriptEditor: './src/packages/components/transcript-editor/index.js',
    TimedTextEditor: './src/packages/components/timed-text-editor/index.js',
    MediaPlayer: './src/packages/components/media-player/index.js',
    ProgressBar: './src/packages/components/media-player/src/ProgressBar.js',
    PlaybackRate: './src/packages/components/media-player/src/PlaybackRate.js',
    PlayerControls: './src/packages/components/media-player/src/PlayerControls/index.js',
    Select: './src/packages/components/media-player/src/Select.js',
    VideoPlayer: './src/packages/components/video-player/index.js',
    Settings: './src/packages/components/settings/index.js',
    KeyboardShortcuts: './src/packages/components/keyboard-shortcuts/index.js',
    timecodeConverter: './src/packages/util/timecode-converter/index.js',
    exportAdapter: './src/packages/export-adapters/index.js',
    sttJsonAdapter: './src/packages/stt-adapters/index.js',
    groupWordsInParagraphsBySpeakersDPE: './src/packages/stt-adapters/digital-paper-edit/group-words-by-speakers.js'
  },
  output: {
    path: path.resolve('dist'),
    filename: '[name].js',
    libraryTarget: 'commonjs2'
  },
  optimization: {
    minimize: true
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: isDevelopment ? '[name].css' : '[name].[hash].css',
      chunkFilename: isDevelopment ? '[id].css' : '[id].[hash].css'
    })
  ],
  module: {
    rules: [
      {
        test: /\.module.(sa|sc|c)ss$/,
        use: [
          isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: { modules: true, sourceMap: isDevelopment }
          },
          {
            loader: 'sass-loader',
            options: { sourceMap: isDevelopment }
          }
        ]
      },
      {
        test: /\.s(a|c)ss$/,
        exclude: /\.module.(s(a|c)ss)$/,
        use: [
          isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: { sourceMap: isDevelopment }
          },
          {
            loader: 'sass-loader',
            options: { sourceMap: isDevelopment }
          }
        ]
      },
      {
        test: /\.(js|ts)x?$/,
        //include: path.resolve(__dirname, 'src'),
        // TODO: because it uses entry point to determine graph of dependencies, might not be needed to exclude test ans sample files?
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [ '@babel/preset-env', '@babel/preset-react' ]
          }
        }
      }
    ]
  },
  plugins: [
      new CheckerPlugin()
  ],
  resolve: {
    alias: {
      'react': path.resolve(__dirname, './node_modules/react'),
      'react-dom': path.resolve(__dirname, './node_modules/react-dom')
    }
  },
  target: 'node', // important in order not to bundle built-in modules like path, fs, etc.
    externals: [nodeExternals({
        // this WILL include `jquery` and `webpack/hot/dev-server` in the bundle, as well as `lodash/*`
        whitelist: ['jquery', 'webpack/hot/dev-server', /^lodash/]
    })],
  externals: {
    // Don't bundle react or react-dom
    react: {
      commonjs: 'react',
      commonjs2: 'react',
      amd: 'React',
      root: 'React'
    },
    'react-dom': {
      commonjs: 'react-dom',
      commonjs2: 'react-dom',
      amd: 'ReactDOM',
      root: 'ReactDOM'
    }
  }
};
