import Phaser from "phaser";
import Card from '../class/Card'; // Import the Card class

class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: "PreloadScene" });
  }

  preload() {
    console.log('Preloading assets and cards...');
    this.scene.launch('LoadingScene');
    this.loadCards(); // Call the method to load cards
  }

  create() {
    console.log('Creating PreloadScene...');
    this.events.once('cardsLoaded', () => {
      this.scene.stop('LoadingScene');
      console.log('Cards loaded, starting GameScene...');
      this.scene.start("MainMenuScene");
    });
  }

  async loadCards() {
    const apiKey = "2742c28f-09da-49a1-b66b-f24a0ebd7b4e";
    const apiUrl = "https://api.pokemontcg.io/v2/cards?q=id:sv5";
    const stored = [];

    try {
      console.log('Fetching Pokémon cards...');
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "X-Api-Key": apiKey,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      const cards = data.data.map(cardData => {
        try {
          console.log('Processing card:', cardData);
          const card = new Card(cardData);
          console.log('Card created:', card);
          return card;
        } catch (error) {
          console.error('Error creating Card instance:', error);
          return null;
        }
      }).filter(card => card !== null);
      stored.push(...cards);
      console.log('Stored cards:', stored);

      this.game.registry.set('stored', stored);

      // Load the first card image
      if (cards.length > 0) {
        this.load.image('firstCard', stored[120].images.small);
        this.load.once('complete', () => {
          this.events.emit('cardsLoaded');
        });
        this.load.start();
      } else {
        this.events.emit('noCardsLoaded'); // No cards to load
      }
    } catch (error) {
      console.error("Error fetching Pokémon cards:", error);
      this.events.emit('cardsLoaded'); // Proceed even if there's an error
    }
  }
}

export default PreloadScene;
