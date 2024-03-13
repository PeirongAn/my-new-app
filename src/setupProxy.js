const { createProxyMiddleware } = require('http-proxy-middleware');
console.log('...')
module.exports = function(app) {
  app.use(
    '/api/*',
    createProxyMiddleware({
      target: 'http://172.16.14.237:5232/',
      changeOrigin: true,
    })
  );
};