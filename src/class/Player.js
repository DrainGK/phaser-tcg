class Player {
  constructor(name) {
    this.name = name;
    this.deck = [];
    this.hand = [];
    this.activePokemon = null;
    this.bench = [];
    this.discardPil = [];
  }
}

export default Player;
