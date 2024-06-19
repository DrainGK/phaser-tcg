class Card {
  constructor({
    name,
    images,
    abilities,
    attacks,
    evolvesTo,
    evolvesFrom,
    hp,
    id,
    number,
    rarity,
    retreatCost,
    subtypes,
    supertype,
    types,
    weaknesses,
    resistances,
  }) {
    this.name = name;
    this.images = images;
    this.abilities = abilities || [];
    this.attacks = attacks;
    this.evolvesTo = evolvesTo || "";
    this.evolvesFrom = evolvesFrom || "";
    this.hp = hp;
    this.id = id;
    this.number = number;
    this.rarity = rarity;
    this.retreatCost = retreatCost || [];
    this.subtypes = subtypes;
    this.supertype = supertype;
    this.types = types;
    this.weaknesses = weaknesses;
    this.resistances = resistances || [];
    this.states = [];
    this.stack = 3;
    this.damages = 0;
  }
}
