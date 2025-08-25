// server.js - 使用 ES 模块语法
import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PORT = process.env.PORT || 3000;
// 创建 HTTP 服务器（Render 需要）
const server = createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('WebSocket Server is running');
});
// 创建 WebSocket 服务器，监听 3000 端口
const wss = new WebSocketServer({ server });

console.log(`WebSocket 服务器已启动在端口 ${PORT}`);

wss.on('connection', function connection(ws) {
  console.log('新的客户端连接');

  // 向客户端发送欢迎消息
  ws.send(JSON.stringify({
    type: 'message',
    content: '欢迎连接到 WebSocket 服务器！',
    timestamp: new Date().toLocaleTimeString()
  }));

  // 定时向客户端发送消息（可选）
  const interval = setInterval(() => {
    ws.send(JSON.stringify({
      type: 'update',
      content: '这是服务器定时发送的消息',
      timestamp: new Date().toLocaleTimeString()
    }));
  }, 10000); // 每10秒发送一次

  // 接收客户端消息
  ws.on('message', function message(data) {
    try {
      const parsedData = JSON.parse(data);
      console.log('收到客户端消息:', parsedData);

      // 广播消息给所有连接的客户端
      wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            type: 'broadcast',
            content: parsedData.content,
            user: parsedData.user || '匿名用户',
            timestamp: new Date().toLocaleTimeString()
          }));
        }
      });
    } catch (error) {
      console.error('消息解析错误:', error);
    }
  });

  // 连接关闭时清理
  ws.on('close', function close() {
    console.log('客户端断开连接');
    clearInterval(interval);
  });
});
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});