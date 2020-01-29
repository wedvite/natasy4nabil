
// Demo
export const project = 'demo';
export const projectTitle = 'Azim & Alia';


export const fireStore = {
    collection: "infos",
    doc: project === "demo" ? "_demo" : project
};

export const themes = [
    "baby-blue-floral",
    "leaves", 
    "wine",
    "vector-pink", 
    "classic",
    "rose",
    "autumn",
    "tropical",
    "flora",
    "brush",
    "blush",
    "elegant",
    "lavender"
];


export const userData = require(`./_infos/client.json`);

export const cfg = {
    name: project,
    title: "Wedvite - " + projectTitle,
}