<template>
  <div id="app">
    <header>
      <h1>示例</h1>
    </header>
    <main>
      <WebSocketChat />
    </main>
  </div>
</template>

<script setup>
import WebSocketChat from './components/WebSocketChat.vue';
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Arial', sans-serif;
  background-color: #f0f2f5;
}

#app {
  min-height: 100vh;
}

header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
  text-align: center;
}

header h1 {
  margin: 0;
  font-size: 2rem;
}

main {
  padding: 20px;
}
</style>