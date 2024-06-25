import Phaser from "phaser";
import BackButton from "./BackButton";

class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene" });
  }

  preload() {
    this.load.image("backButton", "assets/back_button.png");
  }

  create() {
    // Set up the game board and other elements
    const cardImage = this.add.image(200, 300, "firstCard");
    cardImage.setScale(0.8);

    new BackButton(this, 50, 50, (scene) => {
      scene.scene.start("MainMenuScene");
    });

    cardImage.setInteractive();
    this.input.setDraggable(cardImage);

    this.input.on("dragstart", (pointer, gameObject) => {
      gameObject.setScale(0.85); // Slightly scale up on drag start for effect
    });

    this.input.on("drag", (pointer, gameObject, dragX, dragY) => {
      gameObject.x = dragX;
      gameObject.y = dragY;
    });

    this.input.on("dragend", (pointer, gameObject) => {
      gameObject.setScale(0.8); // Scale back to original size on drag end
    });
  }

  update() {
    // Handle game logic and updates
  }
}

export default GameScene;
