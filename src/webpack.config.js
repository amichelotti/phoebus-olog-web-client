module.exports = {
    
    devServer: {
      client: {
        webSocketURL: process.env.REACT_APP_WS_URL || 'ws://localhostaccio:3000/ws',
      },
    },
  };