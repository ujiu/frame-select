<script setup lang="ts">
import { ref } from 'vue'
import injectFrameSelection from '../utils/injectFrameSelection'
import { onMounted } from 'vue'

const rootID = ref('Layout')

onMounted(() => {
  // 注入框选功能
  injectFrameSelection('#Layout', newBoxCallback)
})

// 当生成新盒子时，调用
async function newBoxCallback(newBoxParams: INewBoxParams) {
  console.log(newBoxParams)
}
</script>

<template>
  <div class="root-wrapper" :id="rootID">
    <p class="tips">Try to hold down the mouse and drag at will</p>
  </div>
</template>

<style>
.root-wrapper {
  width: 100vw;
  height: 100vh;
  background-color: white;
  padding: 20px;
}
.tips {
  font-family: Consolas, 'Courier New', Courier, monospace;
  color: #666;
}
.root-wrapper p {
  font-weight: lighter;
  user-select: none;
}
</style>
