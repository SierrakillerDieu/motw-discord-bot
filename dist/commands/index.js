"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commands = void 0;
const discord_js_1 = require("discord.js");
const hunter_1 = require("./hunter");
const scenario_1 = require("./scenario");
exports.commands = [
    ...hunter_1.hunterCommands,
    ...scenario_1.scenarioCommands,
    {
        name: 'roll',
        description: 'Lance un dé pour le jeu',
        execute: async (message, args) => {
            try {
                const faces = args?.length ? parseInt(args[0]) : 6;
                if (isNaN(faces) || faces < 1) {
                    return message.reply({
                        content: 'Veuillez spécifier un nombre valide de faces.'
                    });
                }
                const diceRoll = Math.floor(Math.random() * faces) + 1;
                if (message.channel instanceof discord_js_1.TextChannel) {
                    return message.channel.send({
                        content: `Vous avez lancé un ${diceRoll} (d${faces})`
                    });
                }
            }
            catch (error) {
                console.error('Erreur lors du lancer de dé:', error);
                return message.reply({
                    content: 'Une erreur est survenue lors du lancer de dé.'
                });
            }
        },
    },
    {
        name: 'start',
        description: 'Démarre un nouveau scénario Monster of the Week',
        execute: async (message) => {
            try {
                if (message.channel instanceof discord_js_1.TextChannel) {
                    await message.channel.send({
                        content: 'Démarrage d\'un nouveau scénario...'
                    });
                }
            }
            catch (error) {
                console.error('Erreur lors du démarrage du scénario:', error);
                await message.reply({
                    content: 'Une erreur est survenue lors du démarrage du scénario.'
                });
            }
        },
    },
    {
        name: 'help',
        description: 'Affiche la liste des commandes disponibles',
        execute: async (message) => {
            try {
                const commandList = exports.commands
                    .map(cmd => `**${cmd.name}**: ${cmd.description}`)
                    .join('\n');
                if (message.channel instanceof discord_js_1.TextChannel) {
                    await message.channel.send({
                        content: '**Commandes disponibles:**\n' + commandList,
                        allowedMentions: { parse: [] }
                    });
                }
            }
            catch (error) {
                console.error('Erreur lors de l\'affichage de l\'aide:', error);
                await message.reply({
                    content: 'Une erreur est survenue lors de l\'affichage de l\'aide.'
                });
            }
        },
    }
];
