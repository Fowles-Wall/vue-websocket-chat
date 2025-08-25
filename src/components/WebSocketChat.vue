<template>
  <div class="websocket-demo">
    <h2>WebSocket 聊天室</h2>
    
    <div class="connection-status">
      连接状态: 
      <span :class="[isConnected ? 'connected' : 'disconnected']">
        {{ isConnected ? '已连接' : '未连接' }}
      </span>
      <button @click="toggleConnection">
        {{ isConnected ? '断开连接' : '连接' }}
      </button>
    </div>

    <div class="message-input">
      <input
        v-model="message"
        @keyup.enter="sendMessage"
        placeholder="输入消息..."
        :disabled="!isConnected"
      />
      <button @click="sendMessage" :disabled="!isConnected || !message">
        发送
      </button>
    </div>

    <div class="user-input">
      <input
        v-model="username"
        placeholder="你的昵称"
      />
    </div>

    <div class="messages">
      <h3>消息记录</h3>
      <div v-for="(msg, index) in messages" :key="index" class="message">
        <strong>[{{ msg.timestamp }}]</strong>
        <span v-if="msg.user">{{ msg.user }}: </span>
        {{ msg.content }}
        <em>({{ msg.type }})</em>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onUnmounted } from 'vue';

const isConnected = ref(false);
const message = ref('');
const username = ref('用户' + Math.floor(Math.random() * 1000));
const messages = ref([]);
let socket = null;

const connect = () => {
  socket = new WebSocket(import.meta.env.VITE_WS_URL || 'ws://localhost:3000');

  socket.onopen = () => {
    isConnected.value = true;
    addMessage({ type: 'system', content: '连接服务器成功', timestamp: new Date().toLocaleTimeString() });
  };

  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      addMessage(data);
    } catch (error) {
      addMessage({ 
        type: 'error', 
        content: '收到无效消息: ' + event.data,
        timestamp: new Date().toLocaleTimeString()
      });
    }
  };

  socket.onclose = () => {
    isConnected.value = false;
    addMessage({ type: 'system', content: '连接已关闭', timestamp: new Date().toLocaleTimeString() });
  };

  socket.onerror = (error) => {
    addMessage({ type: 'error', content: '连接错误: ' + error, timestamp: new Date().toLocaleTimeString() });
  };
};

const disconnect = () => {
  if (socket) {
    socket.close();
    socket = null;
  }
};

const toggleConnection = () => {
  if (isConnected.value) {
    disconnect();
  } else {
    connect();
  }
};

const sendMessage = () => {
  if (socket && socket.readyState === WebSocket.OPEN && message.value) {
    const messageData = {
      type: 'chat',
      content: message.value,
      user: username.value,
      timestamp: new Date().toLocaleTimeString()
    };
    
    socket.send(JSON.stringify(messageData));
    message.value = '';
  }
};

const addMessage = (msg) => {
  messages.value.push(msg);
  // 保持消息列表不会太长
  if (messages.value.length > 50) {
    messages.value.shift();
  }
};

// 组件卸载时断开连接
onUnmounted(() => {
  disconnect();
});

// 可选：自动连接
// connect();
</script>

<style scoped>
.websocket-demo {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.connection-status {
  margin: 15px 0;
  padding: 10px;
  background: #f5f5f5;
  border-radius: 5px;
}

.connected {
  color: green;
  font-weight: bold;
}

.disconnected {
  color: red;
  font-weight: bold;
}

.message-input, .user-input {
  margin: 15px 0;
}

input {
  padding: 8px;
  margin-right: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 200px;
}

button {
  padding: 8px 16px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

button:hover:not(:disabled) {
  background: #0056b3;
}

.messages {
  margin-top: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 15px;
  max-height: 400px;
  overflow-y: auto;
}

.message {
  margin: 8px 0;
  padding: 8px;
  border-bottom: 1px solid #eee;
}

.message:last-child {
  border-bottom: none;
}

.message em {
  color: #666;
  font-size: 0.8em;
  margin-left: 10px;
}
</style>