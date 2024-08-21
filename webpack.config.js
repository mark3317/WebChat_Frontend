const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    entry: {
        index: './src/js/index.js',
        mainchat: './src/js/mainchat.js', 
        register: './src/js/register.js', 
    },
    output: {
        filename: '[name].bundle.js', // Используйте шаблон для имен файлов
        path: path.resolve(__dirname, 'dist'),
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader'
                ],
            },
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: 'index.html',
            chunks: ['index']
        }),
        new HtmlWebpackPlugin({
            template: './src/mainchat.html',
            filename: 'mainchat.html',
            chunks: ['mainchat'] // Добавьте соответствующий чанк
        }),
        new HtmlWebpackPlugin({
            template: './src/register.html',
            filename: 'register.html',
            chunks: ['register'] // Добавьте соответствующий чанк
        }),
        new MiniCssExtractPlugin({
            filename: '[name].bundle.css', // Используйте шаблон для имен файлов
        }),
    ],
    devtool: 'source-map',
    devServer: {
        static: [
            {
                directory: path.join(__dirname, 'dist'),
            },
            {
                directory: path.join(__dirname, 'src'),
            }
        ],
        compress: true,
        port: 8082,
        historyApiFallback: true
    }
};