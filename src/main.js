// import Phaser from 'phaser';
// import { config } from './config';
import StartScene from './scenes/StartScene';
import MainMenuScene from './scenes/MainMenuScene';
import GameScene from './scenes/GameScene';
import TaskScene from './scenes/TaskScene';
import LeaderboardScene from './scenes/LeaderboardScene';
import ToiletScene from './scenes/ToiletScene';

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    }
};

const game = new Phaser.Game({
    ...config,
    scene: [StartScene, MainMenuScene, GameScene, TaskScene, LeaderboardScene, ToiletScene]
}); 