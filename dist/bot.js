"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const commands_1 = require("./commands");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
if (!process.env.DISCORD_TOKEN) {
    console.error('Le token Discord est manquant dans le fichier .env');
    process.exit(1);
}
const client = new discord_js_1.Client({
    intents: [
        discord_js_1.GatewayIntentBits.Guilds,
        discord_js_1.GatewayIntentBits.GuildMessages,
        discord_js_1.GatewayIntentBits.MessageContent,
        discord_js_1.GatewayIntentBits.GuildMembers
    ],
});
const prefix = '!';
client.once('ready', () => {
    console.log('Bot Monster of the Week est prêt !');
});
client.on('error', (error) => {
    console.error('Erreur Discord:', error);
});
client.on('messageCreate', async (message) => {
    if (message.author.bot || !message.content.startsWith(prefix))
        return;
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift()?.toLowerCase();
    const command = commands_1.commands.find(cmd => cmd.name === commandName);
    if (!command)
        return;
    try {
        await command.execute(message, args);
    }
    catch (error) {
        console.error('Erreur lors de l\'exécution de la commande:', error);
        await message.reply('Une erreur est survenue lors de l\'exécution de la commande.')
            .catch(e => console.error('Erreur lors de l\'envoi du message d\'erreur:', e));
    }
});
client.login(process.env.DISCORD_TOKEN)
    .catch(error => {
    console.error('Erreur de connexion:', error);
    process.exit(1);
});
