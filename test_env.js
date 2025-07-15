require('dotenv').config();
console.log('Ruta actual:', process.cwd());
console.log('Contenido de PATH:', process.env.PATH);
console.log('Contenido de TEMP:', process.env.TEMP);
console.log('Contenido de DISCORD_BOT_TOKEN (debería ser undefined si el error persiste):', process.env.DISCORD_BOT_TOKEN);
