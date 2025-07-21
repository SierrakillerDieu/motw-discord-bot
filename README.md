# Bot Discord Monster of the Week

## Description
Ce projet est un bot Discord conçu pour jouer à "Monster of the Week", un jeu de rôle sur table. Le bot facilite la partie en gérant les scénarios, les commandes et les interactions avec les joueurs.

## Fonctionnalités
- Démarrer et gérer des scénarios "Monster of the Week".
- Lancer des dés et gérer les mécaniques du jeu.
- Commandes interactives pour permettre aux joueurs de participer à la partie.

## Installation
1. Clonez le dépôt :
   ```bash
   git clone https://github.com/yourusername/motw-discord-bot.git
   ```
2. Allez dans le dossier du projet :
   ```bash
   cd motw-discord-bot
   ```
3. Installez les dépendances :
   ```bash
   npm install
   ```

## Configuration du Bot Discord
1. Rendez-vous sur [Discord Developer Portal](https://discord.com/developers/applications)
2. Cliquez sur "New Application"
3. Donnez un nom à votre application
4. Allez dans la section "Bot"
5. Cliquez sur "Add Bot"
6. Copiez le token du bot
7. Activez les "Privileged Gateway Intents" suivants :
   - MESSAGE CONTENT INTENT
   - PRESENCE INTENT
   - SERVER MEMBERS INTENT

## Utilisation
1. Lancez le bot :
   ```
   npm start
   ```
2. Utilisez les commandes sur votre serveur Discord pour interagir avec le bot et commencer à jouer !

## Commandes
- `!start` : Commencer un nouveau scénario
- `!roll <nombre>` : Lancer un dé avec le nombre de faces spécifié (par défaut: 6)
  Exemples :
  - `!roll` : Lance un dé à 6 faces
  - `!roll 20` : Lance un dé à 20 faces
- `!help` : Afficher la liste des commandes disponibles

### Commandes de Chasseur
- `!hunter create <type>` : Créer un nouveau chasseur
  Types disponibles :
  - `chosen` (L'Élu)
  - `professional` (Le Professionnel)
  - `spooky` (Le Bizarre)
  - `divine` (Le Divin)
  - `expert` (L'Expert)
  - `flake` (L'Initié)
  - `mundane` (L'Ordinaire)
  - `wronged` (Le Vengeur)
- `!hunter show` : Afficher votre fiche de chasseur
- `!hunter edit` : Modifier votre chasseur
  - `!hunter edit name <nom>` : Changer le nom
  - `!hunter edit stats <caractéristique> <valeur>` : Modifier une caractéristique
    - Caractéristiques : charm, cool, futé, coriace, bizarre
  - `!hunter edit moves add <move>` : Ajouter un move
  - `!hunter edit gear add <item>` : Ajouter de l'équipement

### Commandes de Scénario
- `!scenario start` : Démarre un nouveau scénario
- `!scenario show` : Affiche les détails du scénario en cours
- `!scenario progress` : Fait avancer le compte à rebours du scénario
- `!scenario end` : Termine le scénario en cours

## Prérequis
- Node.js (version 16.x ou supérieure)
- npm (inclus avec Node.js)
- Un compte Discord et un serveur Discord
- Un token de bot Discord

## Scripts disponibles
- `npm start` : Démarre le bot
- `npm run dev` : Démarre le bot en mode développement avec rechargement automatique
- `npm run build` : Compile le code TypeScript

## Contribuer
Les contributions sont les bienvenues ! Veuillez soumettre une pull request ou ouvrir une issue pour toute suggestion ou amélioration.

## Licence
Ce projet est sous licence MIT. Voir le fichier LICENSE pour les détails.

## Dépannage
- Si le bot ne répond pas, vérifiez que :
  1. Le token dans le fichier `.env` est correct
  2. Les intents sont activés dans le portail développeur Discord
  3. Le bot a les permissions nécessaires sur le serveur
- En cas d'erreur au démarrage :
  1. Vérifiez que Node.js est bien installé : `node --version`
  2. Vérifiez que toutes les dépendances sont installées : `npm install`
  3. Consultez les logs d'erreur dans la console