const WebSocket = require('ws');
const OBSWebSocket = require('obs-websocket-js').default;
const obs = new OBSWebSocket();
require('dotenv').config();


// สร้างคิวสำหรับเก็บข้อความ (object {id, message})
const messageQueue = [];
let isProcessing = false;

const wss = new WebSocket.Server({ port: process.env.PORT || 8080 });


// เชื่อมต่อกับ OBS WebSocket
async function connectToOBS() {
    try {
        await obs.connect(`ws://${process.env.OBS_HOST}:${process.env.OBS_PORT}`, process.env.OBS_PASSWORD); // ถ้ามีรหัสผ่าน ให้ใส่ที่นี่
        console.log('Connected to OBS WebSocket');
    } catch (error) {
        console.error('Failed to connect to OBS:', error);
    }
}

// ฟังก์ชัน broadcast สถานะไปยังทุก client
function broadcast(update) {
    const data = JSON.stringify(update);
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    });
}

// ฟังก์ชันประมวลผลคิวข้อความ
async function processQueue() {
    if (isProcessing || messageQueue.length === 0) return;
    isProcessing = true;

    const item = messageQueue.shift(); // ดึง {id, message} แรกจากคิว
    try {
        // อัปเดตสถานะเป็น processing
        broadcast({ id: item.id, message: item.message, status: 'processing' });

        // ส่งข้อความไป OBS Text Source
        await obs.call('SetInputSettings', {
            inputName: 'TextAlert',
            inputSettings: { text: item.message }
        });

        // รีสตาร์ท Media Source สำหรับเสียงแจ้งเตือน
        await obs.call('TriggerMediaInputAction', {
            inputName: 'AlertSound',
            mediaAction: 'OBS_WEBSOCKET_MEDIA_INPUT_ACTION_RESTART'
        });

        // รอ 5 วินาที (แสดงข้อความ)
        await new Promise((resolve) => setTimeout(resolve, 5000));

        // ล้างข้อความใน OBS
        await obs.call('SetInputSettings', {
            inputName: 'TextAlert',
            inputSettings: { text: '' }
        });

        // อัปเดตสถานะเป็น sent
        broadcast({ id: item.id, message: item.message, status: 'sent' });

        // รอ cooldown 5 วินาที
        await new Promise((resolve) => setTimeout(resolve, 5000));
    } catch (error) {
        console.error('Error processing message:', error);
    }

    isProcessing = false;
    processQueue(); // ประมวลผลข้อความถัดไป
}

connectToOBS();

wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.on('message', (data) => {
        try {
            const { id, message } = JSON.parse(data);
            console.log('Received message:', message, 'with ID:', id);
            messageQueue.push({ id, message }); // เพิ่มลงในคิว

            // Broadcast สถานะ queued ไปยังทุก client
            broadcast({ id, message, status: 'queued' });

            processQueue(); // เริ่มประมวลผลคิวถ้ายังไม่เริ่ม
        } catch (error) {
            console.error('Invalid JSON received:', error);
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

console.log(`WebSocket server running on ws://${process.env.OBS_HOST}:${process.env.PORT || 8080}`);
