import Phaser from "phaser";
import BootScene from "./scenes/BootScene";
import PreloadScene from "./scenes/PreloadScene";
import GameScene from "./scenes/GameScene";
import MainMenuScene from "./scenes/MainMenuScene";
import LoadingScene from "./scenes/LoadingScene";

const config = {
  type: Phaser.AUTO,
  width: 1000,
  height: 800,
  backgroundColor: "#3498DB",
  scene: [BootScene, PreloadScene, MainMenuScene, GameScene, LoadingScene],
};

const game = new Phaser.Game(config);
