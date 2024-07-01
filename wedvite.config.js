
// Demo
export const project = "natasy4nabil";
export const wishlistDoc = "natasy4nabil";
export const projectTitle = "Natasya & Nabil";

export const allowedEmails = [
  "fadziljusri@gmail.com",
  // 
]

export const fireStore = {
  collection: "infos",
  doc: project === "demo" ? "_demo" : project
};

export const fireStoreProtected = {
  collection: "infos_protected",
  doc: project === "demo" ? "_demo" : project
}

export const fireStoreWishlist = {
  collection: "wishlist",
  doc: project === "demo" ? "_demo" : wishlistDoc
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

export const rsvpOptions = [
  { value: 'Hadir', class: 'is-success', faIcon: 'smile-wink' },
  // { value: 'Maybe', class: 'is-link', faIcon: 'meh' },
  { value: 'Tidak Hadir', class: 'is-warning', faIcon: 'frown', hidePax: true },
];

export const rsvpMaxPax = 10;

export const metaOgImage = [
  // Comment below if needed
  // { property: 'og:image', content: '/images/sample-1.jpg' },
  // { property: 'og:image:secure_url', content: '/images/sample-1.jpg' }
]

export const userData = require(`./_infos/client.json`);

export const cfg = {
  name: project,
  title: "Wedding of - " + projectTitle,
}