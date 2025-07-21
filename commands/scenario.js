"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scenarioCommands = void 0;
const discord_js_1 = require("discord.js");
const activeScenarios = new Map();
const phasesFr = [
    'jour',
    'crépuscule',
    'ombres',
    'coucher',
    'nuit',
    'minuit'
];
// Mapping entre les phases françaises et anglaises
const phasesMapping = {
    'jour': 'day',
    'crépuscule': 'dusk',
    'ombres': 'shadows',
    'coucher': 'sunset',
    'nuit': 'nightfall',
    'minuit': 'midnight'
};
// Mapping inverse pour l'affichage
const phasesReverseMapping = {
    'day': 'jour',
    'dusk': 'crépuscule',
    'shadows': 'ombres',
    'sunset': 'coucher',
    'nightfall': 'nuit',
    'midnight': 'minuit'
};
exports.scenarioCommands = [
    {
        name: 'scenario',
        description: 'Gérer les scénarios',
        execute: async (message, args) => {
            if (!args?.length) {
                return message.reply('Usage : !scenario <start|show|progress|end>');
            }
            const [subCommand, ...subArgs] = args;
            switch (subCommand.toLowerCase()) {
                case 'start':
                    return handleStart(message, subArgs);
                case 'show':
                    return handleShow(message);
                case 'progress':
                    return handleProgress(message);
                case 'end':
                    return handleEnd(message);
                default:
                    return message.reply('Commande invalide. Utilisez start, show, progress ou end.');
            }
        }
    }
];
async function handleStart(message, args) {
    if (!message.guildId) {
        return message.reply('Cette commande doit être utilisée dans un serveur.');
    }
    if (activeScenarios.has(message.guildId)) {
        return message.reply('Un scénario est déjà en cours !');
    }
    const scenario = {
        id: Date.now().toString(),
        title: 'La Malédiction du Manoir',
        description: 'Un vieux manoir est hanté par une présence malveillante...',
        monster: {
            name: 'Le Spectre Vengeur',
            type: 'Spectre',
            description: 'Un esprit ancien assoiffé de vengeance',
            weakness: 'Les objets personnels de son ancienne vie',
            attacks: ['Toucher glacial (2-harm)', 'Possession (3-harm)'],
            harm: 7
        },
        locations: [
            {
                name: 'Le Manoir',
                description: 'Une demeure victorienne délabrée aux secrets bien gardés'
            }
        ],
        clues: ['Des marques étranges sur les murs', 'Un journal intime daté de 1887'],
        hooks: ['Des disparitions mystérieuses', 'Des bruits étranges la nuit'],
        countdown: {
            day: 'Des objets se déplacent tout seuls',
            dusk: 'Une présence glaciale envahit le manoir',
            shadows: 'Le spectre apparaît aux fenêtres',
            sunset: 'Premier contact violent avec les visiteurs',
            nightfall: 'Le spectre commence à posséder des victimes',
            midnight: 'Le spectre déchaîne sa puissance destructrice'
        },
        status: 'not_started'
    };
    activeScenarios.set(message.guildId, scenario);
    const embed = new discord_js_1.EmbedBuilder()
        .setTitle('Nouveau Scénario : ' + scenario.title)
        .setDescription(scenario.description)
        .addFields({ name: 'Situation', value: scenario.hooks.join('\n'), inline: false }, { name: 'Lieux', value: scenario.locations.map(l => l.name).join('\n'), inline: true });
    return safeSend(message, embed);
}
async function handleShow(message) {
    if (!message.guildId) {
        return message.reply('Cette commande doit être utilisée dans un serveur.');
    }
    const scenario = activeScenarios.get(message.guildId);
    if (!scenario) {
        return message.reply('Aucun scénario en cours.');
    }
    const embed = new discord_js_1.EmbedBuilder()
        .setTitle(scenario.title)
        .setDescription(scenario.description)
        .addFields({ name: 'Monstre', value: scenario.monster.name, inline: true }, { name: 'Type', value: scenario.monster.type, inline: true }, { name: 'Faiblesse', value: scenario.monster.weakness, inline: true }, { name: 'Indices', value: scenario.clues.join('\n'), inline: false }, { name: 'Lieux', value: scenario.locations.map(l => l.name).join('\n'), inline: false });
    return safeSend(message, embed);
}
async function handleProgress(message) {
    if (!message.guildId) {
        return message.reply('Cette commande doit être utilisée dans un serveur.');
    }
    const scenario = activeScenarios.get(message.guildId);
    if (!scenario) {
        return message.reply('Aucun scénario en cours.');
    }
    // Déterminer la phase actuelle
    let currentPhaseFr;
    if (scenario.status === 'not_started') {
        currentPhaseFr = 'jour';
    }
    else if (scenario.status === 'completed') {
        return message.reply('Le scénario est déjà terminé !');
    }
    else {
        // Le scénario est en cours, on doit déterminer la phase actuelle
        // Pour simplifier, on va stocker la phase actuelle dans une propriété personnalisée
        // ou utiliser une logique basée sur le statut
        const scenarioWithPhase = scenario;
        currentPhaseFr = scenarioWithPhase.currentPhase || 'jour';
    }
    const currentIndex = phasesFr.indexOf(currentPhaseFr);
    if (currentIndex >= phasesFr.length - 1) {
        scenario.status = 'completed';
        activeScenarios.set(message.guildId, scenario);
        return message.reply('Le compte à rebours est terminé ! Le scénario est maintenant complet.');
    }
    const nextPhaseFr = phasesFr[currentIndex + 1];
    const nextPhaseEn = phasesMapping[nextPhaseFr];
    // Marquer le scénario comme en cours et sauvegarder la phase actuelle
    scenario.status = 'in_progress';
    scenario.currentPhase = nextPhaseFr;
    activeScenarios.set(message.guildId, scenario);
    const embed = new discord_js_1.EmbedBuilder()
        .setTitle('Progression du Scénario')
        .setDescription(`Phase : ${nextPhaseFr}`)
        .addFields({
        name: 'Événement',
        value: scenario.countdown[nextPhaseEn],
        inline: false
    });
    return safeSend(message, embed);
}
async function handleEnd(message) {
    if (!message.guildId) {
        return message.reply('Cette commande doit être utilisée dans un serveur.');
    }
    const scenario = activeScenarios.get(message.guildId);
    if (!scenario) {
        return message.reply('Aucun scénario en cours.');
    }
    activeScenarios.delete(message.guildId);
    return message.reply('Le scénario est terminé.');
}
function safeSend(message, embed) {
    if ('send' in message.channel && typeof message.channel.send === 'function') {
        return message.channel.send({ embeds: [embed] });
    }
    else {
        return message.reply('Ce canal ne permet pas l\'envoi d\'embed.');
    }
}
