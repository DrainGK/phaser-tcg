import Phaser from "phaser";

class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: "PreloadScene" });
  }

  preload() {
    // Load assets here
    // Example: this.load.image('card-back', 'assets/card-back.png');
  }

  create() {
    this.scene.start("GameScene");
  }
}

export default PreloadScene;
