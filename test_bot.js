require('dotenv').config();

const { Client, GatewayIntentBits } = require('discord.js');
const express = require('express');

const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const port = process.env.PORT || 3000;

if (!DISCORD_BOT_TOKEN) {
    console.error('❌ Error: DISCORD_BOT_TOKEN no está configurado en las variables de entorno.');
    process.exit(1);
}

const client = new Client({
    intents: [GatewayIntentBits.Guilds],
});

let botReady = false;

client.once('ready', () => {
    botReady = true;
    console.log(`✅ [TEST BOT] Conectado a Discord como ${client.user.tag}`);
});

client.on('error', error => {
    console.error('❌ [TEST BOT] Error del cliente de Discord (evento "error"):', error);
});

console.log('📡 [TEST BOT] Iniciando sesión en Discord...');
const discordLoginPromise = client.login(DISCORD_BOT_TOKEN);

const timeoutPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
        if (!botReady) {
            reject(new Error('⏱️ Timeout: El bot no se conectó ni disparó "ready" en 120 segundos.'));
        } else {
            resolve();
        }
    }, 120000); // 120 segundos
});

Promise.race([discordLoginPromise, timeoutPromise])
    .then(() => {
        if (botReady) {
            console.log('🎉 [TEST BOT] ¡Bot de prueba conectado exitosamente!');
        } else {
            console.warn('⚠️ [TEST BOT] Login exitoso, pero el evento "ready" no ocurrió dentro del tiempo esperado.');
        }
    })
    .catch(error => {
        console.error('❌ [TEST BOT] FALLO en la conexión del bot de prueba:', error.message);
        console.warn('⚠️ Continuando sin conexión del bot. El backend Express seguirá funcionando.');
        // Importante: No hacemos `process.exit(1)` aquí para no interrumpir el backend.
    });

// --- Express server para mantener Render activo ---
const app = express();
app.get('/', (req, res) => res.send('🟢 Backend y test_bot activos.'));
app.listen(port, () => {
    console.log(`[TEST BOT] Express server escuchando en el puerto ${port}`);
});
