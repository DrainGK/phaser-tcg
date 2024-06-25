import Phaser from "phaser";

class TitleScreenScene extends Phaser.Scene {
  constructor() {
    super({ key: "TitleScreenScene" });
  }

  preload() {
    this.load.image("startButton", "assets/zizi.png");
  }

  create() {
    const startButtonImage = this.add.image(0, 0, "startButton");
    startButtonImage.setOrigin(0.5, 0.5);

    const startButtonText = this.add.text(0, 0, "START", {
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
          this.scene.start("PreloadScene");
        },
        [],
        this
      );
    });
  }
}

export default TitleScreenScene;
