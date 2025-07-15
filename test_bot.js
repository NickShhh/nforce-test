require('dotenv').config();

const { Client, GatewayIntentBits } = require('discord.js');

const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;

if (!DISCORD_BOT_TOKEN) {
    console.error('Error: DISCORD_BOT_TOKEN no está configurado en las variables de entorno.');
    process.exit(1);
}

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds, // El intent más básico para conectarse
        // No añadas otros intents aquí por ahora para minimizar posibles puntos de fallo.
        // Si funciona solo con Guilds, luego podemos añadir más.
    ]
});

let botReady = false; // Flag para rastrear si el bot entró en estado "ready"

client.once('ready', () => {
    botReady = true;
    console.log(`¡[TEST BOT] Conectado a Discord como ${client.user.tag}!`);
    // No llamamos a process.exit() aquí. Dejamos que el servidor Express mantenga la aplicación viva para Render.
});

client.on('error', error => {
    console.error('[TEST BOT] Error del cliente de Discord (evento "error"):', error);
    // Este evento captura errores de la conexión del bot después del login.
});

console.log('[TEST BOT] Intentando iniciar sesión de Discord...');

const discordLoginPromise = client.login(DISCORD_BOT_TOKEN);
const timeoutPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
        if (!botReady) {
            // Si el bot no está "ready" después de 60 segundos, rechazamos el timeout.
            reject(new Error('Timeout: El bot de Discord de prueba no se conectó o no disparó el evento "ready" en 60 segundos.'));
        } else {
            // Si el bot ya está "ready", resolvemos el timeout (no es un error).
            resolve();
        }
    }, 60000); // 60 segundos de tiempo límite
});

Promise.race([discordLoginPromise, timeoutPromise])
    .then(() => {
        console.log('[TEST BOT] La promesa de login/timeout se resolvió exitosamente.');
        if (!botReady) {
            console.warn('[TEST BOT] ADVERTENCIA: La promesa de login resolvió, pero el evento "ready" no se disparó en 60 segundos. El bot podría no estar completamente operativo.');
        }
    })
    .catch(error => {
        console.error('[TEST BOT] Error FATAL al iniciar el bot de prueba de Discord:', error);
        // Salimos solo si hay un error explícito en el login o el timeout.
        process.exit(1);
    });

// --- Servidor Express para mantener el servicio activo en Render ---
const express = require('express');
const app = express();
const port = process.env.PORT || 3000; // Render usa process.env.PORT
app.get('/', (req, res) => res.send('Test bot express server running.'));
app.listen(port, () => console.log(`[TEST BOT] Express server listening on port ${port}`));
