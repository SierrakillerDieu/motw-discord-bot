"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scenarios = void 0;
exports.scenarios = [
    {
        title: "La Hantise",
        description: "Un esprit tourmenté sème le chaos dans une petite ville.",
        setup: () => {
            console.log("Mise en place du scénario La Hantise...");
            // Logique de configuration supplémentaire ici
        },
        interactions: (playerInput) => {
            switch (playerInput.toLowerCase()) {
                case "enquêter":
                    return "Vous trouvez des indices qui vous mènent au vieux manoir.";
                case "exorciser":
                    return "Vous tentez de bannir l'esprit, mais il résiste !";
                default:
                    return "L'esprit semble insensible à vos actions.";
            }
        }
    },
    {
        title: "La Créature des Bois",
        description: "Une créature mystérieuse a été aperçue dans les bois voisins.",
        setup: () => {
            console.log("Mise en place du scénario La Créature des Bois...");
            // Logique de configuration supplémentaire ici
        },
        interactions: (playerInput) => {
            switch (playerInput.toLowerCase()) {
                case "pister":
                    return "Vous suivez les traces plus profondément dans les bois.";
                case "poser un piège":
                    return "Vous posez un piège et attendez que la créature apparaisse.";
                default:
                    return "Vous restez immobile, incertain de la suite à donner.";
            }
        }
    }
];
