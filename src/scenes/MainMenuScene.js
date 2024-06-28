import Phaser from "phaser";

class MainMenuScene extends Phaser.Scene {
  constructor() {
    super({ key: "MainMenuScene" });
  }

  preload() {
    this.load.image("startButton", "assets/zizi.png");
  }

  create() {
    const startButtonImage = this.add.image(0, 0, "startButton");
    startButtonImage.setOrigin(0.5, 0.5);

    const startButtonText = this.add.text(0, 0, "FIGHT", {
      fontSize: "50px",
      fill: "#fff",
    });
    startButtonText.setOrigin(0.5, 0.5);

    const startButton = this.add.container(500, 400, [
      startButtonImage,
      startButtonText,
    ]);

    startButton.setSize(startButtonImage.width, startButtonImage.height);
    startButton.setScale(0.5);

    startButton.setInteractive();

    startButton.on("pointerdown", () => {
      console.log("clicked");
      startButton.setScale(0.55);
      this.time.delayedCall(
        100,
        () => {
          this.scene.start("GameScene");
        },
        [],
        this
      );
    });

    const deckMenuButtonImage = this.add.image(0, 0, "startButton");
    deckMenuButtonImage.setOrigin(0.5, 0.5);

    const deckMenuButtonText = this.add.text(0, 0, "DECK", {
      fontSize: "50px",
      fill: "#fff",
    });
    deckMenuButtonText.setOrigin(0.5, 0.5);

    const deckMenuButton = this.add.container(500, 600, [
      deckMenuButtonImage,
      deckMenuButtonText,
    ]);

    deckMenuButton.setSize(
      deckMenuButtonImage.width,
      deckMenuButtonImage.height
    );
    deckMenuButton.setScale(0.5);

    deckMenuButton.setInteractive();

    deckMenuButton.on("pointerdown", () => {
      console.log("clicked");
      deckMenuButton.setScale(0.55);
      this.time.delayedCall(
        100,
        () => {
          this.scene.start("DeckMenuScene");
        },
        [],
        this
      );
    });
  }
}

export default MainMenuScene;
