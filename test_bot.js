require('dotenv').config(); // Asegúrate de que esto no causa problemas si no usas .env en Render

const { Client, GatewayIntentBits } = require('discord.js');

// Asegúrate de que este token proviene de las variables de entorno de Render
const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;

if (!DISCORD_BOT_TOKEN) {
    console.error('Error: DISCORD_BOT_TOKEN no está configurado en las variables de entorno.');
    process.exit(1);
}

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds, // El intent más básico para conectarse
        // No añadas otros intents por ahora para minimizar posibles fallos
    ]
});

client.once('ready', () => {
    console.log(`¡[TEST BOT] Conectado a Discord como ${client.user.tag}!`);
    // Si el bot se conecta, Render dejará de dar timeout y verás este mensaje.
    // Aquí puedes hacer un process.exit(0) si no quieres que Render intente servir una web.
    // O simplemente dejar que Render lo detecte como un worker.
});

client.on('error', error => {
    console.error('[TEST BOT] Error del cliente de Discord:', error);
    // Puedes agregar más manejo de errores si es necesario
});

console.log('[TEST BOT] Intentando iniciar sesión...');
client.login(DISCORD_BOT_TOKEN)
    .then(() => console.log('[TEST BOT] La promesa de login se resolvió (¡bot conectado o intentando conectar!).'))
    .catch(error => {
        console.error('[TEST BOT] Error al iniciar sesión:', error);
        // Si llega aquí, el login falló antes del timeout manual
        process.exit(1);
    });

// Para que Render no se queje de "No open ports detected" en un Web Service
// Puedes comentar esto si lo despliegas como un "Worker" en Render.
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
app.get('/', (req, res) => res.send('Test bot express server running.'));
app.listen(port, () => console.log(`[TEST BOT] Express server listening on port ${port}`));
