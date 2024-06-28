import Phaser from "phaser";

class BackButton extends Phaser.GameObjects.Container {
    constructor(scene, x, y, callback, text) {
        const backButtonImage = scene.add.image(0, 0, "backButton").setOrigin(0.5, 0.5);
        const backButtonText = scene.add.text(0, 0, `${text}`, {
            fontSize: "50px",
            fill: "#fff"
        }).setOrigin(0.5, 0.5);

        super(scene, x, y, [backButtonImage, backButtonText]);
        this.setSize(backButtonImage.width, backButtonImage.height);
        this.setScale(0.3);
        this.setInteractive();

        this.on("pointerdown", () => {
            console.log("clicked");
            this.setScale(0.35);
            scene.time.delayedCall(100, () => {
                callback(scene);
                this.setScale(0.30);
            }, [], scene);
        });

        scene.add.existing(this);
    }
}

export default BackButton;
