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
        description: 'Lance 2 dés à 6 faces (2D6) + modificateur de stat',
        execute: async (message, args) => {
            try {
                // Vérifier si un modificateur de stat est fourni
                let statModifier = 0;
                if (args?.length && args[0]) {
                    statModifier = parseInt(args[0]);
                    if (isNaN(statModifier)) {
                        return message.reply({
                            content: 'Veuillez spécifier un modificateur de stat valide.\nExemple: `!roll +2` ou `!roll -1`'
                        });
                    }
                }

                // Lancer automatiquement 2 dés à 6 faces
                const dice1 = Math.floor(Math.random() * 6) + 1;
                const dice2 = Math.floor(Math.random() * 6) + 1;
                const diceTotal = dice1 + dice2;
                const finalTotal = diceTotal + statModifier;

                // Formater l'affichage du modificateur
                const modifierDisplay = statModifier === 0 ? '' : 
                    statModifier > 0 ? ` + ${statModifier}` : ` - ${Math.abs(statModifier)}`;

                if (message.channel instanceof discord_js_1.TextChannel) {
                    return message.channel.send({
                        content: `🎲 **Lancer de dés (2D6${modifierDisplay})** 🎲\n` +
                                `Dé 1: **${dice1}**\n` +
                                `Dé 2: **${dice2}**\n` +
                                `Résultat des dés: **${diceTotal}**\n` +
                                (statModifier !== 0 ? `Modificateur de stat: **${statModifier > 0 ? '+' : ''}${statModifier}**\n` : '') +
                                `**Total final: ${finalTotal}**`
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
                
                const helpMessage = '**Commandes disponibles:**\n' + commandList + 
                    '\n\n**Exemples d\'utilisation de roll:**\n' +
                    '`!roll` - Lance 2D6 sans modificateur\n' +
                    '`!roll +3` - Lance 2D6 + 3\n' +
                    '`!roll -2` - Lance 2D6 - 2';

                if (message.channel instanceof discord_js_1.TextChannel) {
                    await message.channel.send({
                        content: helpMessage,
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