import Phaser from "phaser";

class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene" });
  }

  create() {
    // Set up the game board and other elements
    const cardImage = this.add.image(200, 300, 'firstCard');
    cardImage.setScale(0.8);

    cardImage.setInteractive();
    this.input.setDraggable(cardImage);

    this.input.on('dragstart', (pointer, gameObject) => {
      gameObject.setScale(0.85); // Slightly scale up on drag start for effect
    });

    this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
      gameObject.x = dragX;
      gameObject.y = dragY;
    });

    this.input.on('dragend', (pointer, gameObject) => {
      gameObject.setScale(0.8); // Scale back to original size on drag end
    });
    }

  update() {
    // Handle game logic and updates
  }
}

export default GameScene;
