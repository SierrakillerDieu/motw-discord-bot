"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MysteryKeeper = void 0;

// Types pour les thèmes disponibles
type ScenarioTheme = 
    | "Science-Fiction et Paranormal Moderne"
    | "Humour Noir et Absurde"
    | "Conspiration et Menaces Latentes"
    | "Drame Personnel et Conséquences"
    | "Action et Combat"
    | "Mystère et Enquête"
    | "Horreur Classique";

// Interface pour la configuration du scénario
interface ScenarioConfig {
    themes: ScenarioTheme[];
    concept: string;
    targetHunter?: string; // Requis si "Drame Personnel et Conséquences" est sélectionné
}

// Interface pour un scénario généré
interface GeneratedScenario {
    id: string;
    title: string;
    description: string;
    themes: ScenarioTheme[];
    targetHunter?: string;
    monster: {
        name: string;
        type: string;
        description: string;
        weakness: string;
        attacks: string[];
        harm: number;
    };
    locations: Array<{
        name: string;
        description: string;
    }>;
    clues: string[];
    hooks: string[];
    countdown: {
        day: string;
        dusk: string;
        shadows: string;
        sunset: string;
        nightfall: string;
        midnight: string;
    };
    personalTwists?: string[]; // Spécifique au drame personnel
    interactions: (playerInput: string) => string;
}

class MysteryKeeper {
    private readonly availableThemes: ScenarioTheme[] = [
        "Science-Fiction et Paranormal Moderne",
        "Humour Noir et Absurde",
        "Conspiration et Menaces Latentes",
        "Drame Personnel et Conséquences",
        "Action et Combat",
        "Mystère et Enquête",
        "Horreur Classique"
    ];

    // Banques de données thématiques
    private readonly themeData = {
        "Science-Fiction et Paranormal Moderne": {
            monsters: ["Entité Numérique", "Alien Infiltré", "IA Corrompue", "Mutant Cybernétique"],
            locations: ["Laboratoire High-Tech", "Centre de Données", "Station Spatiale", "Bunker Militaire"],
            attacks: ["Surcharge Électrique", "Manipulation Mentale", "Virus Numérique", "Rayon Laser"],
            weaknesses: ["EMP", "Code de Désactivation", "Isolation Réseau", "Fréquence Sonique"]
        },
        "Humour Noir et Absurde": {
            monsters: ["Bureaucrate Démoniaque", "Clown Vengeur", "Mime Psychopathe", "Mascotte Possédée"],
            locations: ["Bureau Kafkaïen", "Cirque Abandonné", "Centre Commercial Démesuré", "Parc d'Attractions Glauque"],
            attacks: ["Paperasse Infinie", "Blague Mortelle", "Silence Assourdissant", "Câlin Étouffant"],
            weaknesses: ["Logique Pure", "Sens de l'Humour", "Spontanéité", "Bonne Humeur"]
        },
        "Conspiration et Menaces Latentes": {
            monsters: ["Agent Double", "Culte Secret", "Corporation Maléfique", "Illuminati Déchu"],
            locations: ["Siège Social", "Base Secrète", "Hôtel de Luxe", "Université Prestigieuse"],
            attacks: ["Chantage", "Manipulation Sociale", "Poison Subtil", "Accident Arrangé"],
            weaknesses: ["Preuve Irréfutable", "Témoins Protégés", "Médias Indépendants", "Lanceur d'Alerte"]
        },
        "Drame Personnel et Conséquences": {
            monsters: ["Fantôme du Passé", "Obsession Incarnée", "Culpabilité Vivante", "Regret Vengeur"],
            locations: ["Maison d'Enfance", "Ancien Lieu de Travail", "Cimetière Familial", "Scène du Drame"],
            attacks: ["Rappel Douloureux", "Culpabilisation", "Manipulation Émotionnelle", "Révélation Cruelle"],
            weaknesses: ["Acceptation", "Pardon", "Vérité", "Réconciliation"]
        },
        "Action et Combat": {
            monsters: ["Mercenaire Cybernétique", "Bête Enragée", "Guerrier Mort-Vivant", "Machine de Guerre"],
            locations: ["Entrepôt Industriel", "Terrain Vague", "Base Militaire", "Arène Clandestine"],
            attacks: ["Assault Rifle", "Griffes Acérées", "Explosion", "Charge Brutale"],
            weaknesses: ["Tactique Supérieure", "Armement Lourd", "Terrain Favorable", "Travail d'Équipe"]
        },
        "Mystère et Enquête": {
            monsters: ["Tueur en Série", "Esprit Manipulateur", "Maître Chanteur", "Imposteur Parfait"],
            locations: ["Bibliothèque Ancienne", "Manoir Victorien", "Commissariat", "Morgue Municipale"],
            attacks: ["Meurtre Discret", "Fausse Piste", "Manipulation de Preuves", "Alibi Parfait"],
            weaknesses: ["Déduction Logique", "Analyse Forensique", "Témoignage Clé", "Erreur Fatale"]
        },
        "Horreur Classique": {
            monsters: ["Vampire Ancestral", "Loup-Garou Alpha", "Démon Invoqué", "Zombie Viral"],
            locations: ["Château Gothique", "Forêt Maudite", "Cimetière Profané", "Asile Abandonné"],
            attacks: ["Morsure Vampirique", "Griffes Bestiales", "Possession", "Contagion"],
            weaknesses: ["Eau Bénite", "Argent Pur", "Exorcisme", "Feu Purificateur"]
        }
    };

    /**
     * Valide la configuration du scénario
     */
    private validateConfig(config: ScenarioConfig): boolean {
        // Vérifier le nombre de thèmes (maximum 3)
        if (config.themes.length === 0 || config.themes.length > 3) {
            throw new Error("Vous devez choisir entre 1 et 3 thèmes maximum.");
        }

        // Vérifier que tous les thèmes sont valides
        for (const theme of config.themes) {
            if (!this.availableThemes.includes(theme)) {
                throw new Error(`Thème invalide : ${theme}`);
            }
        }

        // Vérifier si le drame personnel nécessite un hunter cible
        if (config.themes.includes("Drame Personnel et Conséquences") && !config.targetHunter) {
            throw new Error("Le thème 'Drame Personnel et Conséquences' nécessite de spécifier un hunter cible.");
        }

        // Vérifier que le concept n'est pas vide
        if (!config.concept.trim()) {
            throw new Error("Le concept du scénario ne peut pas être vide.");
        }

        return true;
    }

    /**
     * Sélectionne un élément aléatoire dans un tableau
     */
    private randomChoice<T>(array: T[]): T {
        return array[Math.floor(Math.random() * array.length)];
    }

    /**
     * Combine les données de plusieurs thèmes
     */
    private combineThemeData(themes: ScenarioTheme[]) {
        const combined = {
            monsters: [] as string[],
            locations: [] as string[],
            attacks: [] as string[],
            weaknesses: [] as string[]
        };

        for (const theme of themes) {
            const data = this.themeData[theme];
            combined.monsters.push(...data.monsters);
            combined.locations.push(...data.locations);
            combined.attacks.push(...data.attacks);
            combined.weaknesses.push(...data.weaknesses);
        }

        return combined;
    }

    /**
     * Génère un titre basé sur les thèmes et le concept
     */
    private generateTitle(themes: ScenarioTheme[], concept: string): string {
        const titlePrefixes = {
            "Science-Fiction et Paranormal Moderne": ["Nexus", "Signal", "Protocol", "Matrix"],
            "Humour Noir et Absurde": ["Cirque", "Paradoxe", "Théâtre", "Carnaval"],
            "Conspiration et Menaces Latentes": ["Ombres", "Réseau", "Projet", "Opération"],
            "Drame Personnel et Conséquences": ["Mémoires", "Échos", "Fantômes", "Cicatrices"],
            "Action et Combat": ["Assaut", "Guerre", "Combat", "Bataille"],
            "Mystère et Enquête": ["Énigme", "Affaire", "Mystère", "Enquête"],
            "Horreur Classique": ["Malédiction", "Hantise", "Cauchemar", "Terreur"]
        };

        const primaryTheme = themes[0];
        const prefix = this.randomChoice(titlePrefixes[primaryTheme]);
        
        // Extraction d'un mot-clé du concept
        const conceptWords = concept.split(' ').filter(word => word.length > 3);
        const keyWord = conceptWords.length > 0 ? this.randomChoice(conceptWords) : "Inconnu";
        
        return `${prefix} de ${keyWord}`;
    }

    /**
     * Génère un countdown thématique
     */
    private generateCountdown(themes: ScenarioTheme[], concept: string, targetHunter?: string): GeneratedScenario['countdown'] {
        const baseEvents = {
            day: "Les premiers signes étranges apparaissent",
            dusk: "La situation commence à dégénérer",
            shadows: "Les menaces se précisent",
            sunset: "Le conflit éclate au grand jour",
            nightfall: "Les conséquences deviennent irréversibles",
            midnight: "L'apocalypse finale se déchaîne"
        };

        // Personnalisation selon le thème principal
        const primaryTheme = themes[0];
        
        if (primaryTheme === "Drame Personnel et Conséquences" && targetHunter) {
            return {
                day: `${targetHunter} commence à avoir des flashbacks troublants`,
                dusk: `Le passé de ${targetHunter} refait surface de manière inquiétante`,
                shadows: `${targetHunter} est confronté à ses démons intérieurs`,
                sunset: `Les conséquences des actes passés de ${targetHunter} se manifestent`,
                nightfall: `${targetHunter} doit faire face à la vérité sur son passé`,
                midnight: `Le destin de ${targetHunter} se joue dans un affrontement final avec ses regrets`
            };
        }

        return baseEvents;
    }

    /**
     * Génère les interactions basées sur les thèmes
     */
    private generateInteractions(themes: ScenarioTheme[], concept: string): (playerInput: string) => string {
        return (playerInput: string): string => {
            const input = playerInput.toLowerCase();
            
            // Actions communes
            if (input.includes("enquêter") || input.includes("chercher")) {
                return "Vos recherches révèlent des détails troublants sur la situation...";
            }
            
            if (input.includes("combattre") || input.includes("attaquer")) {
                return "Vous engagez le combat, mais votre adversaire est plus coriace que prévu !";
            }

            // Actions spécifiques aux thèmes
            if (themes.includes("Science-Fiction et Paranormal Moderne")) {
                if (input.includes("hacker") || input.includes("scanner")) {
                    return "Vos outils technologiques révèlent des anomalies dans les données...";
                }
            }

            if (themes.includes("Mystère et Enquête")) {
                if (input.includes("analyser") || input.includes("déduire")) {
                    return "Votre analyse méthodique vous mène vers une piste prometteuse...";
                }
            }

            if (themes.includes("Drame Personnel et Conséquences")) {
                if (input.includes("confesser") || input.includes("pardonner")) {
                    return "Cette action courageuse pourrait être la clé pour résoudre le conflit intérieur...";
                }
            }

            return "Votre action semble avoir peu d'effet sur la situation actuelle.";
        };
    }

    /**
     * Génère un scénario complet à partir de la configuration
     */
    public generateScenario(config: ScenarioConfig): GeneratedScenario {
        // Validation de la configuration
        this.validateConfig(config);

        // Combinaison des données thématiques
        const combinedData = this.combineThemeData(config.themes);

        // Génération des éléments du scénario
        const title = this.generateTitle(config.themes, config.concept);
        const monster = {
            name: this.randomChoice(combinedData.monsters),
            type: config.themes[0], // Type basé sur le thème principal
            description: `Une entité liée à : ${config.concept}`,
            weakness: this.randomChoice(combinedData.weaknesses),
            attacks: [
                this.randomChoice(combinedData.attacks) + " (2-harm)",
                this.randomChoice(combinedData.attacks) + " (3-harm)"
            ],
            harm: Math.floor(Math.random() * 5) + 5 // Entre 5 et 9
        };

        const locations = [
            {
                name: this.randomChoice(combinedData.locations),
                description: `Un lieu mystérieux en rapport avec ${config.concept}`
            }
        ];

        const clues = [
            `Des indices en lien avec ${config.concept}`,
            `Des traces de l'activité de ${monster.name}`
        ];

        const hooks = [
            config.concept,
            `L'apparition de ${monster.name} sème le trouble`
        ];

        // Éléments spécifiques au drame personnel
        let personalTwists: string[] | undefined;
        if (config.themes.includes("Drame Personnel et Conséquences") && config.targetHunter) {
            personalTwists = [
                `${config.targetHunter} découvre un lien personnel avec l'affaire`,
                `Le passé de ${config.targetHunter} complique la résolution`,
                `${config.targetHunter} doit choisir entre justice et rédemption`
            ];
        }

        const countdown = this.generateCountdown(config.themes, config.concept, config.targetHunter);
        const interactions = this.generateInteractions(config.themes, config.concept);

        return {
            id: Date.now().toString(),
            title,
            description: `Un scénario ${config.themes.join(", ").toLowerCase()} : ${config.concept}`,
            themes: config.themes,
            targetHunter: config.targetHunter,
            monster,
            locations,
            clues,
            hooks,
            countdown,
            personalTwists,
            interactions
        };
    }

    /**
     * Méthode utilitaire pour obtenir la liste des thèmes disponibles
     */
    public getAvailableThemes(): ScenarioTheme[] {
        return [...this.availableThemes];
    }

    /**
     * Méthode utilitaire pour créer une configuration de scénario
     */
    public createConfig(themes: ScenarioTheme[], concept: string, targetHunter?: string): ScenarioConfig {
        return { themes, concept, targetHunter };
    }
}

// Export de la classe et des types
exports.MysteryKeeper = MysteryKeeper;

// Exemple d'utilisation :
/*
const keeper = new MysteryKeeper();

// Scénario simple
const config1 = keeper.createConfig(
    ["Horreur Classique", "Mystère et Enquête"], 
    "Des disparitions étranges dans un petit village de montagne"
);

// Scénario avec drame personnel
const config2 = keeper.createConfig(
    ["Drame Personnel et Conséquences", "Action et Combat"],
    "Un ancien partenaire revient pour se venger",
    "Marcus le Tireur"
);

const scenario1 = keeper.generateScenario(config1);
const scenario2 = keeper.generateScenario(config2);

console.log("Scénario généré :", scenario1.title);
console.log("Description :", scenario1.description);
*/