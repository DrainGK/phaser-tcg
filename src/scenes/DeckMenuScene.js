import Phaser from "phaser";
import BackButton from "./BackButton";
import DropDown from "./DropDown";
import LargeButton from "./LargeButton";

class DeckMenuScene extends Phaser.Scene {
  constructor() {
    super({ key: "DeckMenuScene" });
    this.storedCards = [];
    this.cardsListContainer = null; // Store reference to the cards container
    this.isDeckVisible = false;
    this.scrollEnabled = false;
  }

  preload() {
    this.load.image("backButton", "assets/back_button.png");
    this.load.image("minusButton", "assets/minus_button.png");
    this.load.image("plusButton", "assets/plus_button.png");
    this.load.image("grayButton", "assets/gray_button.png");
    this.load.image("largeButton", "assets/large_button.png");
    this.load.image("text", "assets/text.png");
  }

  create() {
    this.storedCards = this.game.registry.get("stored");
    this.createBackground();
    this.deck = []; // Initialize the deck as an array
    this.createCardSprites();
  }

  createBackground() {
    let graphics = this.add.graphics(); // Create a Graphics object
    graphics.fillStyle(0xfaa300, 1); // Set the color and alpha
    graphics.fillRect(
      0,
      0,
      this.sys.game.config.width,
      this.sys.game.config.height * 0.12
    ); // Draw the rectangle
    graphics.setDepth(50);
    const backButton = new BackButton(
      this,
      50,
      50,
      (scene) => {
        this.cleanup();
        scene.scene.start("MainMenuScene");
      },
      "BACK"
    );
    backButton.setDepth(50);
    const deckButton = new BackButton(
      this,
      950,
      50,
      (scene) => {
        this.scrollEnabled = !this.scrollEnabled;
        this.createCardSprites();
        this.deckContainerToggle();
      },
      "DECK"
    );
    deckButton.setDepth(50);
    let dropDownSupertypes = new DropDown(
      this,
      100,
      20,
      ["Pokémon", "Trainer", "Energy"],
      this.filterSupertypes.bind(this)
    );
    dropDownSupertypes.setDepth(100);
    let dropDownTypes = new DropDown(
      this,
      375,
      20,
      [
        "Grass",
        "Fire",
        "Water",
        "Lightning",
        "Fighting",
        "Psychic",
        "Colorless",
        "Darkness",
        "Metal",
        "Dragon",
        "Fairy",
      ],
      this.filterTypes.bind(this)
    );
    dropDownTypes.setDepth(100);
    let dropDownSubtypes = new DropDown(
      this,
      650,
      20,
      ["Basic", "Stage 1", "Stage 2", "Ultra Beast", "Ancient", "Future", "ex"],
      this.filterSubtypes.bind(this)
    );
    dropDownSubtypes.setDepth(100);
  }

  filterSupertypes(selectedType) {
    console.log("Filtering cards for type:", selectedType);
    this.filteredDeck = this.storedCards.filter(
      (card) => card.supertype === selectedType
    );
    this.createCardSprites(this.filteredDeck);
  }

  filterTypes(selectedType) {
    this.filteredDeck = this.storedCards.filter((card) =>
      card.types?.includes(selectedType)
    );
    this.createCardSprites(this.filteredDeck);
  }

  filterSubtypes(selectedType) {
    this.filteredDeck = this.storedCards.filter((card) =>
      card.subtypes?.includes(selectedType)
    );
    this.createCardSprites(this.filteredDeck);
  }

  getTotalDeckSize() {
    return this.deck.length;
  }

  findCardInDeck(cardId) {
    return this.deck.filter((card) => card.id === cardId);
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

    this.cardsListContainer = this.add
      .container(200, 200)
      .setSize(
        cardsPerRow * (cardWidth + paddingX),
        Math.ceil(cards.length / cardsPerRow) * (cardHeight + paddingY)
      );

    this.cardsListContainer.setDepth(10);

    cards.forEach((card, index) => {
      const x = (index % cardsPerRow) * (cardWidth + paddingX);
      const y = Math.floor(index / cardsPerRow) * (cardHeight + paddingY);

      const cardSprite = this.add
        .sprite(x, y, "placeholder")
        .setScale(0.5)
        .setInteractive();
      cardSprite.setDepth(11);
      let count = this.findCardInDeck(card.id).length;

      const cardCountingText = this.add
        .text(x, y + 125, `${count}`, {
          fontSize: "16px",
          fill: "#fff",
        })
        .setOrigin(0.5, 0.5);

      const minusButtonImage = this.add
        .image(x - 30, y + 125, "minusButton")
        .setInteractive()
        .setScale(0.15);
      minusButtonImage.on("pointerdown", () => {
        if (count > 0) {
          count = this.findCardInDeck(card.id).length;
          this.removeCardFromDeck(card, cardCountingText);
          console.log(`deck length: ${this.deck.length}`, this.deck);
        }
      });

      const plusButtonImage = this.add
        .image(x + 30, y + 125, "plusButton")
        .setInteractive()
        .setScale(0.15);
      plusButtonImage.on("pointerdown", () => {
        count = this.findCardInDeck(card.id).length;
        if (count < 4) {
          this.addCardToDeck(card, cardCountingText);
          console.log(
            `deck length: ${this.deck.length}`,
            this.deck,
            `count: `,
            count
          );
        }
      });

      this.cardsListContainer.add([
        cardSprite,
        minusButtonImage,
        plusButtonImage,
        cardCountingText,
      ]);

      this.load.image(card.id, card.images.small);
      this.load.once("complete", () => {
        cardSprite.setTexture(card.id);
      });
      this.load.start();
    });

    this.add.existing(this.cardsListContainer);
    if (!this.scrollEnabled) {
      this.setupScrolling(this.cardsListContainer);
    }
  }

  addCardToDeck(card, textElement) {
    let cardCount = this.findCardInDeck(card.id).length;
    if (cardCount < 4 && this.getTotalDeckSize() < 60) {
      card.count++;
      this.deck.push(card);
      textElement.setText(`${cardCount + 1}`);
    }
    console.log(this.deck); // Log deck to see its content
  }

  removeCardFromDeck(card, textElement) {
    let cardIndex = this.deck.findIndex((deckCard) => deckCard.id === card.id);
    if (cardIndex !== -1) {
      this.deck.splice(cardIndex, 1);
      let cardCount = this.findCardInDeck(card.id).length;
      textElement.setText(`${cardCount}`);
    }
    console.log(this.deck); // Log deck to see its content
  }

  displayDeck(deckContainer) {
    deckContainer.removeAll(); // Clear any existing children

    const cardWidth = 75;
    const cardHeight = 100;
    const cardsPerRow = 4;
    const paddingX = 25;
    const paddingY = 25;

    // Aggregate the cards by their name and count occurrences
    const cardCounts = this.deck.reduce((acc, card) => {
      if (!acc[card.id]) {
        acc[card.id] = { ...card, count: 0 };
      }
      acc[card.id].count++;
      return acc;
    }, {});

    const uniqueCards = Object.values(cardCounts);

    deckContainer.setSize(
      cardsPerRow * (cardWidth + paddingX),
      Math.ceil(uniqueCards.length / cardsPerRow) * (cardHeight + paddingY)
    );

    uniqueCards.forEach((card, index) => {
      const x = (index % cardsPerRow) * (cardWidth + paddingX);
      const y = Math.floor(index / cardsPerRow) * (cardHeight + paddingY);

      const cardSprite = this.add
        .sprite(x, y, "placeholder")
        .setScale(0.3)
        .setInteractive();
      cardSprite.setDepth(11);

      deckContainer.add(cardSprite);

      this.load.image(card.id, card.images.small);
      this.load.once("complete", () => {
        cardSprite.setTexture(card.id);
      });
      this.load.start();

      const countSprite = this.add
        .sprite(x, y + cardHeight / 2, "grayButton")
        .setScale(0.07)
        .setInteractive();
      countSprite.setDepth(12);
      deckContainer.add(countSprite);

      // Display the count of the card
      const countText = this.add
        .text(x, y + cardHeight / 2, `${card.count}`, {
          fontSize: "20px",
          color: "#000000",
          align: "center",
        })
        .setOrigin(0.5);
      deckContainer.add(countText);
    });
  }

  displayDeckInfos(container) {
    const textPanelImage = this.add.image(0, 0, "text");
    textPanelImage.setOrigin(0.5, 0.5);

    const textPanelText = this.add.text(0, 0, "Deck I", {
      fontSize: "75px",
      fill: "#000000",
    });
    textPanelText.setOrigin(0.5, 0.5);

    const textPanel = this.add.container(250, 0, [
      textPanelImage,
      textPanelText,
    ]);

    textPanel.setSize(textPanelImage.width, textPanelImage.height);
    textPanel.setScale(0.3);

    textPanel.setInteractive();
    textPanel.setDepth(50);

    const largeButton = new LargeButton(
      this,
      50,
      50,
      (scene) => {
        console.log("zizi");
      },
      "Pokemon"
    );
    largeButton.setDepth(50);

    container.add(textPanel);
    container.add(largeButton);
  }

  deckContainerToggle() {
    this.isDeckVisible = !this.isDeckVisible; // Toggle the state
    if (!this.graphics) {
      this.graphics = this.add.graphics();
    }
    this.graphics.clear(); // Clear previous graphics

    this.graphics.fillStyle(0xf8c957, 1); // Set the color and alpha

    if (this.isDeckVisible) {
      this.graphics.fillRect(500, 0, 500, this.sys.game.config.height); // Draw the rectangle
      this.graphics.setDepth(49);

      if (this.deckContainer) {
        this.deckContainer.destroy(); // Destroy the previous container
        this.deckInfosContainer.destroy(); // Destroy the previous container
      }
      this.deckContainer = this.add
        .container(600, 400)
        .setSize(500, this.sys.game.config.height);
      this.deckInfosContainer = this.add
        .container(500, 150)
        .setSize(500, this.sys.game.config.height);
      this.deckContainer.setDepth(50);
      this.deckInfosContainer.setDepth(50);

      this.displayDeck(this.deckContainer);
      this.displayDeckInfos(this.deckInfosContainer);
      console.log("DECK Visible");
    } else {
      this.graphics.clear();
      if (this.deckContainer) {
        this.deckContainer.destroy();
        this.deckInfosContainer.destroy();
        this.deckContainer = null;
        this.deckInfosContainer = null;
      }
      console.log("DECK Hidden");
    }
  }

  setupScrolling(container) {
    this.input.on("wheel", (pointer, _, deltaX, deltaY) => {
      let newY = container.y - deltaY * 3;
      const lowerBound = -(
        container.height -
        (this.sys.game.config.height - 50)
      );
      newY = Phaser.Math.Clamp(newY, lowerBound, 200);
      container.y = newY;
    });

    let mask = this.make.graphics({
      x: 0,
      y: 0,
      add: false,
    });

    mask.fillStyle(0xffffff, 1);
    mask.beginPath();
    mask.fillRect(
      0,
      110,
      this.sys.game.config.width,
      this.sys.game.config.height - 20
    );
    mask.closePath();
    mask.fillPath();

    let debugGraphics = this.add.graphics();

    debugGraphics.lineStyle(2, 0xff0000, 1);
    debugGraphics.strokeRect(
      0,
      110,
      this.sys.game.config.width,
      this.sys.game.config.height - 20
    );

    container.setMask(mask.createGeometryMask());
  }

  cleanup() {
    // Clean up graphics and containers
    if (this.graphics) {
      this.graphics.destroy();
      this.graphics = null;
    }
    if (this.cardsListContainer) {
      this.cardsListContainer.destroy();
      this.cardsListContainer = null;
    }
    if (this.deckContainer) {
      this.deckContainer.destroy();
      this.deckContainer = null;
    }
    this.isDeckVisible = false;
  }
}

export default DeckMenuScene;
