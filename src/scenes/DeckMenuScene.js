import Phaser from "phaser";
import BackButton from "./BackButton";
import DropDown from "./DropDown";

class DeckMenuScene extends Phaser.Scene {
  constructor() {
    super({ key: "DeckMenuScene" });
    this.storedCards = [];
    this.cardsListContainer = null; // Store reference to the cards container
  }

  preload() {
    this.load.image("backButton", "assets/back_button.png");
    this.load.image("minusButton", "assets/minus_button.png");
    this.load.image("plusButton", "assets/plus_button.png");
    this.load.image("grayButton", "assets/gray_button.png");
  }

  create() {
    this.storedCards = this.game.registry.get("stored");
    this.createBackground();
    const backButton = new BackButton(this, 50, 50, (scene) => {
      scene.scene.start("MainMenuScene");
    });
    backButton.setDepth(50);
    let dropDownMenu = new DropDown(this, 100, 20, ["Pokémon", "Trainer", "Energy"], this.filterCards.bind(this));
    dropDownMenu.setDepth(100);
    this.deck = []; // Initialize the deck as an array
    this.createCardSprites();
  }

  createBackground() {
    let graphics = this.add.graphics(); // Create a Graphics object
    graphics.fillStyle(0xFAA300, 1); // Set the color and alpha
    graphics.fillRect(0, 0, this.sys.game.config.width, this.sys.game.config.height * 0.12); // Draw the rectangle
    graphics.setDepth(50);
  }

  filterCards(selectedType) {
    console.log("Filtering cards for type:", selectedType);
    this.filteredDeck = this.storedCards.filter(card => card.supertype === selectedType);
    this.createCardSprites(this.filteredDeck);
  }

  getTotalDeckSize() {
    return this.deck.length;
  }

  findCardInDeck(cardId) {
    return this.deck.filter(card => card.id === cardId);
  }

  createCardSprites(cards = this.storedCards) {
    if (this.cardsListContainer) {
      this.cardsListContainer.destroy(); // Destroy the previous container
    }

    const cardWidth = 100;
    const cardHeight = 150;
    const cardsPerRow = 5;
    const paddingX = 50;
    const paddingY = 100;

    this.cardsListContainer = this.add.container(200, 200).setSize(
      cardsPerRow * (cardWidth + paddingX),
      Math.ceil(cards.length / cardsPerRow) * (cardHeight + paddingY)
    );

    this.cardsListContainer.setDepth(10);

    cards.forEach((card, index) => {
      const x = (index % cardsPerRow) * (cardWidth + paddingX);
      const y = Math.floor(index / cardsPerRow) * (cardHeight + paddingY);

      const cardSprite = this.add.sprite(x, y, "placeholder").setScale(0.5).setInteractive();
      cardSprite.setDepth(11);
      let count = this.findCardInDeck(card.id).length;

      const cardCountingText = this.add.text(x, y + 125, `${count}`, {
        fontSize: "16px",
        fill: "#fff"
      }).setOrigin(0.5, 0.5);

      const minusButtonImage = this.add.image(x - 30, y + 125, "minusButton").setInteractive().setScale(0.15);
      minusButtonImage.on("pointerdown", () => {
        if (count > 0) {
          count = this.findCardInDeck(card.id).length;
          this.removeCardFromDeck(card, cardCountingText);
          console.log(`deck length: ${this.deck.length}`, this.deck);
        }
      });

      const plusButtonImage = this.add.image(x + 30, y + 125, "plusButton").setInteractive().setScale(0.15);
      plusButtonImage.on("pointerdown", () => {
        count = this.findCardInDeck(card.id).length;
        if (count < 3) {
          this.addCardToDeck(card, cardCountingText);
          console.log(`deck length: ${this.deck.length}`, this.deck, `count: `, count);
        }
      });

      this.cardsListContainer.add([cardSprite, minusButtonImage, plusButtonImage, cardCountingText]);

      this.load.image(card.id, card.images.small);
      this.load.once("complete", () => {
        cardSprite.setTexture(card.id);
      });
      this.load.start();
    });

    this.add.existing(this.cardsListContainer);
    this.setupScrolling(this.cardsListContainer);
  }

  addCardToDeck(card, textElement) {
    let cardCount = this.findCardInDeck(card.id).length;
    if (cardCount < 3 && this.getTotalDeckSize() < 60) {
      card.count++;
      this.deck.push(card);
      textElement.setText(`${cardCount + 1}`);
    }
    console.log(this.deck); // Log deck to see its content
  }

  removeCardFromDeck(card, textElement) {
    let cardIndex = this.deck.findIndex(deckCard => deckCard.id === card.id);
    if (cardIndex !== -1) {
      this.deck.splice(cardIndex, 1);
      let cardCount = this.findCardInDeck(card.id).length;
      textElement.setText(`${cardCount}`);
    }
    console.log(this.deck); // Log deck to see its content
  }

  setupScrolling(cardsListContainer) {
    this.input.on("wheel", (pointer, _, deltaX, deltaY) => {
      let newY = cardsListContainer.y - deltaY * 3;
      const lowerBound = -(cardsListContainer.height - (this.sys.game.config.height - 50));
      newY = Phaser.Math.Clamp(newY, lowerBound, 200);
      cardsListContainer.y = newY;
    });

    let mask = this.make.graphics({
      x: 0,
      y: 0,
      add: false
    });

    mask.fillStyle(0xffffff, 1);
    mask.beginPath();
    mask.fillRect(0, 110, this.sys.game.config.width, this.sys.game.config.height - 20);
    mask.closePath();
    mask.fillPath();

    cardsListContainer.setMask(mask.createGeometryMask());
  }
}

export default DeckMenuScene;
