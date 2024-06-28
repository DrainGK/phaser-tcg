import Phaser from "phaser";

class LargeButton extends Phaser.GameObjects.Container {
    constructor(scene, x, y, callback, text) {
        const largeButtonImage = scene.add.image(0, 0, "largeButton").setOrigin(0.5, 0.5);
        const largeButtonText = scene.add.text(0, 0, `${text}`, {
            fontSize: "50px",
            fill: "#fff"
        }).setOrigin(0.5, 0.5);

        super(scene, x, y, [largeButtonImage, largeButtonText]);
        this.setSize(largeButtonImage.width, largeButtonImage.height);
        this.setScale(0.075);
        this.setInteractive();

        this.on("pointerdown", () => {
            console.log("clicked");
            this.setScale(0.1);
            scene.time.delayedCall(100, () => {
                callback(scene);
                this.setScale(0.075);
            }, [], scene);
        });

        scene.add.existing(this);
    }
}

export default LargeButton;
