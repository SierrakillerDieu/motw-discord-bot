"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hunterCommands = void 0;
const hunter_1 = require("../types/hunter");
const hunters = new Map();
exports.hunterCommands = [
    {
        name: 'hunter',
        description: 'Gérer votre chasseur',
        execute: async (message, args) => {
            if (!args?.length) {
                return message.reply('Usage: !hunter <create|show|edit> [options]');
            }
            const [subCommand, ...subArgs] = args;
            switch (subCommand.toLowerCase()) {
                case 'create':
                    return handleCreate(message, subArgs);
                case 'show':
                    return handleShow(message);
                case 'edit':
                    return handleEdit(message, subArgs);
                default:
                    return message.reply('Commande invalide. Utilisez create, show ou edit.');
            }
        }
    }
];
async function handleCreate(message, args) {
    const type = args[0]?.toLowerCase();
    if (hunters.has(message.author.id)) {
        return message.reply('Vous avez déjà un chasseur. Utilisez !hunter show pour le voir.');
    }
    if (!Object.values(hunter_1.HunterType).includes(type)) {
        return message.reply('Type de chasseur invalide. Types disponibles : ' +
            Object.values(hunter_1.HunterType).join(', '));
    }
    const hunter = {
        userId: message.author.id,
        type: type,
        name: message.author.username,
        stats: {
            charm: 0,
            cool: 0,
            sharp: 0,
            tough: 0,
            weird: 0
        },
        harm: 0,
        luck: 7,
        experience: 0,
        moves: [],
        gear: []
    };
    hunters.set(message.author.id, hunter);
    return message.reply(`Chasseur de type ${type} créé avec succès !`);
}
async function handleShow(message) {
    const hunter = hunters.get(message.author.id);
    if (!hunter) {
        return message.reply('Vous n\'avez pas encore de chasseur. Utilisez !hunter create pour en créer un.');
    }
    const stats = Object.entries(hunter.stats)
        .map(([stat, value]) => `${stat}: ${value}`)
        .join('\n');
    return message.reply({
        embeds: [{
                title: `${hunter.name} - ${hunter.type}`,
                fields: [
                    { name: 'Statistiques', value: stats, inline: true },
                    { name: 'Santé', value: `${hunter.harm}/7`, inline: true },
                    { name: 'Chance', value: `${hunter.luck}/7`, inline: true },
                    { name: 'Expérience', value: hunter.experience.toString(), inline: true },
                    { name: 'Moves', value: hunter.moves.join('\n') || 'Aucun', inline: false },
                    { name: 'Équipement', value: hunter.gear.join('\n') || 'Aucun', inline: false }
                ]
            }]
    });
}
async function handleEdit(message, args) {
    const hunter = hunters.get(message.author.id);
    if (!hunter) {
        return message.reply('Vous n\'avez pas encore de chasseur.');
    }
    const [field, ...values] = args;
    const value = values.join(' ');
    switch (field) {
        case 'name':
            hunter.name = value;
            break;
        case 'stats': {
            const [stat, statValue] = values;
            const validStats = ['charm', 'cool', 'futé', 'coriace', 'bizarre'];
            if (validStats.includes(stat)) {
                const newValue = parseInt(statValue) || 0;
                if (newValue >= -3 && newValue <= 3) {
                    hunter.stats[stat] = newValue;
                }
                else {
                    return message.reply('La valeur doit être comprise entre -3 et 3.');
                }
            }
            else {
                return message.reply('Statistique invalide. Utilisez : charm, cool, futé, coriace ou bizarre.');
            }
            break;
        }
        case 'moves':
            hunter.moves.push(value);
            break;
        case 'gear':
            hunter.gear.push(value);
            break;
        default:
            return message.reply('Champ invalide. Utilisez name, stats, moves ou gear.');
    }
    hunters.set(message.author.id, hunter);
    return message.reply('Chasseur mis à jour avec succès !');
}
