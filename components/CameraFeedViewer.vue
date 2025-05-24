<script setup lang="ts">
const props = defineProps<{
  showDevices: boolean;
}>();

interface DeviceImage {
  esp_hmac: string;
  image_data: string;
  timestamp: number;
}

const deviceImages = ref<DeviceImage[]>([]);
const wsStatus = ref<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');
const wsError = ref<string | null>(null);
let socket: WebSocket | null = null;

function connectWebSocket() {
  if (socket) {
    socket.close();
  }

  const token = useAuthStore().token;
  if (!token) {
    wsError.value = 'Authentication token not found';
    wsStatus.value = 'error';
    return;
  }

  try {
    wsStatus.value = 'connecting';
    wsError.value = null;

    // Simple approach with token in URL
    const config = useRuntimeConfig();
    const wsUrl = `${config.public.apiBase.replace('http', 'ws')}/ws/devices/all?token=${encodeURIComponent(token)}`;
    socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      console.log('WebSocket connection established');
      wsStatus.value = 'connected';
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        deviceImages.value = Array.isArray(data) ? data : [data];
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      wsStatus.value = 'error';
      wsError.value = 'Connection error, please try again.';
    };

    socket.onclose = () => {
      console.log('WebSocket connection closed');
      wsStatus.value = 'disconnected';
    };
  } catch (error) {
    console.error('Failed to create WebSocket connection:', error);
    wsStatus.value = 'error';
    wsError.value = 'Failed to create connection';
  }
}

function closeWebSocket() {
  if (socket) {
    socket.close();
    socket = null;
    deviceImages.value = [];
    wsStatus.value = 'disconnected';
  }
}

watch(() => props.showDevices, (newVal) => {
  if (newVal) {
    connectWebSocket();
  } else {
    closeWebSocket();
  }
});

onBeforeUnmount(() => {
  closeWebSocket();
});
</script>

<template>
  <div v-if="showDevices" class="space-y-4 mb-6">
    <div class="flex items-center space-x-2">
      <span class="text-sm" :class="{
        'text-green-500': wsStatus === 'connected',
        'text-yellow-500': wsStatus === 'connecting',
        'text-red-500': wsStatus === 'error',
        'text-gray-400': wsStatus === 'disconnected'
      }">
        <span v-if="wsStatus === 'connected'">● Connected</span>
        <span v-else-if="wsStatus === 'connecting'">● Connecting...</span>
        <span v-else-if="wsStatus === 'error'">● Connection Error</span>
        <span v-else>● Disconnected</span>
      </span>
      <button v-if="wsStatus !== 'connecting' && (wsStatus === 'error' || wsStatus === 'disconnected')"
        @click="connectWebSocket" class="text-xs bg-brand/20 hover:bg-brand/30 py-1 px-2 rounded-md transition-colors">
        Reconnect
      </button>
    </div>

    <div v-if="wsError" class="bg-red-500/20 text-red-300 p-3 rounded-lg text-sm">
      {{ wsError }}
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="device in deviceImages" :key="device.esp_hmac" class="bg-white/10 p-3 rounded-xl">
        <h5 class="mb-2">Device: {{ device.esp_hmac }}</h5>
        <p class="text-xs text-white/70">{{ new Date(device.timestamp).toLocaleString() }}</p>
        <div class="mt-2 rounded-lg overflow-hidden">
          <img :src="device.image_data" alt="ESP Camera Feed" class="w-full h-auto" />
        </div>
      </div>
      <div v-if="deviceImages.length === 0 && wsStatus === 'connected'" class="col-span-full text-center py-8">
        <p>Waiting for camera feeds...</p>
      </div>
    </div>
  </div>
</template>
