import Phaser from "phaser";
import BootScene from "./scenes/BootScene";
import PreloadScene from "./scenes/PreloadScene";
import GameScene from "./scenes/GameScene";
import MainMenuScene from "./scenes/MainMenuScene";
import LoadingScene from "./scenes/LoadingScene";
import TitleScreenScene from "./scenes/TitleScreenScene";
import DeckMenuScene from "./scenes/DeckMenuScene";

const config = {
  type: Phaser.AUTO,
  width: 1000,
  height: 800,
  backgroundColor: "#3498DB",
  scene: [
    BootScene,
    PreloadScene,
    MainMenuScene,
    GameScene,
    LoadingScene,
    TitleScreenScene,
    DeckMenuScene,
  ],
};

const game = new Phaser.Game(config);
