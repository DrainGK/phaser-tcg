import Phaser from "phaser";

class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: "BootScene" });
  }

  preload() {
    // Load any assets required for the PreloadScene
  }

  create() {
    this.scene.start("MainMenuScene");
  }
}

export default BootScene;
