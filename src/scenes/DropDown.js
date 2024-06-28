import Phaser from 'phaser';

const yellow = 0xF8C957;
const orange = 0xFAA300;
const blue = 0x3498DB;

class DropDown extends Phaser.GameObjects.Container {
    constructor(scene, x, y, options, callback, defaultIndex = 0) {
        super(scene, x, y);
        this.scene = scene;
        this.options = options;
        this.currentIndex = defaultIndex;
        this.callback = callback;

        // Background for the dropdown
        this.background = this.scene.add.graphics();
        this.background.lineStyle(2, 0xFFFFFF, 1); // White border
        this.background.fillStyle(blue, 1);
        this.background.fillRect(0, 0, 250, 60); // Main background
        this.background.strokeRect(0, 0, 250, 60); // Stroke for the border

        // Text for displaying the current selection
        this.selectionText = this.scene.add.text(125, 5, this.options[this.currentIndex], {
            fontSize: '20px',
            color: '#FFFFFF',
            align: 'center'
        }).setOrigin(0.5, 0); // Center the text

        // Container to hold the options
        this.optionsContainer = this.scene.add.container(0, 60);
        this.optionsContainer.setVisible(false);

        // Create text objects for each option
        this.options.forEach((option, index) => {
            let optionBG = this.scene.add.graphics();
            optionBG.lineStyle(2, 0xFFFFFF, 1); // White border
            optionBG.fillStyle(index === this.currentIndex ? yellow : blue, 1);
            optionBG.fillRect(0, index * 40, 250, 40);
            optionBG.strokeRect(0, index * 40, 250, 40); // Stroke for the border

            let optionText = this.scene.add.text(10, index * 40 + 10, option, {
                fontSize: '20px',
                color: '#FFFFFF'
            }).setInteractive();

            optionText.on('pointerover', () => {
                optionText.setColor(`#FAA300`);
            });

            optionText.on('pointerout', () => {
                optionText.setColor('#FFFFFF');
            });

            optionText.on('pointerdown', () => {
                this.selectOption(index);
            });

            this.optionsContainer.add([optionBG, optionText]);
        });

        this.add([this.background, this.selectionText, this.optionsContainer]);
        this.scene.add.existing(this);

        // Making the selection text interactive
        this.selectionText.setInteractive();
        this.selectionText.setDepth(100);
        this.scene.input.setTopOnly(false);

        this.selectionText.on('pointerdown', () => {
            this.toggleOptions();
        });
    }

    toggleOptions() {
        this.optionsContainer.setVisible(!this.optionsContainer.visible);
    }

    selectOption(index) {
        const allItems = this.optionsContainer.getAll();
        // Reset all items to their default state
        allItems.forEach((item, idx) => {
            if (item instanceof Phaser.GameObjects.Graphics) {
                item.clear();
                item.lineStyle(2, 0xFFFFFF, 1); // White border
                item.fillStyle(blue, 1); // Default color
                item.fillRect(0, Math.floor(idx / 2) * 40, 250, 40);
                item.strokeRect(0, Math.floor(idx / 2) * 40, 250, 40); // Stroke for the border
            } else if (item instanceof Phaser.GameObjects.Text) {
                item.setColor('#FFFFFF'); // Default text color
            }
        });

        // Update the selected item
        let selectedGraphics = allItems[index * 2]; // Even index: Graphics
        let selectedText = allItems[index * 2 + 1]; // Odd index: Text

        if (selectedGraphics && selectedText) {
            selectedGraphics.clear();
            selectedGraphics.lineStyle(2, 0xFFFFFF, 1); // White border
            selectedGraphics.fillStyle(yellow, 1); // Highlight color
            selectedGraphics.fillRect(0, index * 40, 250, 40);
            selectedGraphics.strokeRect(0, index * 40, 250, 40); // Stroke for the border
            selectedText.setColor('#FF0000'); // Highlight text color
        } else {
            console.error('Failed to access graphics or text for option at index', index);
        }

        this.currentIndex = index;
        this.selectionText.setText(this.options[index]);
        this.selectionText.x = 125 - this.selectionText.width / 2; // Re-center the text
        this.toggleOptions();
        console.log("Invoking callback with:", this.options[index]);

        if (this.callback && typeof this.callback === 'function') {
            this.callback(this.options[index]);
        }
    }
}

export default DropDown;
