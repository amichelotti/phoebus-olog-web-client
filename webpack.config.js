const webpack = require('webpack');
const path = require('path');
require('dotenv').config(); // Load environment variables from .env file

module.exports = {
    
    devServer: {
      client: {
        webSocketURL: process.env.REACT_APP_WS_URL || 'ws://localhostaccio:3000/ws',
      },
    },
  };
  