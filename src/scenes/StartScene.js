import Phaser from 'phaser';

export default class StartScene extends Phaser.Scene {
    constructor() {
        super({ key: 'StartScene' });
    }

    preload() {
        // Загрузка музыки для меню
        this.load.audio('menu-music', 'assets/01_-doomsday.mp3');
        this.load.image('rudolf-walk2', 'assets/rudolf-walk2.png');
        this.load.image('logo', 'assets/logo.png');
    }

    create() {
        // Добавляем фон
        this.add.rectangle(400, 300, 800, 600, 0x000000);

        // Добавляем логотип по центру сверху
        this.add.image(400, 70, 'logo').setOrigin(0.5, 0.5).setScale(0.25);

        // Добавляем изображение Рудольфа как кнопку
        const rudolfBtn = this.add.image(400, 340, 'rudolf-walk2').setOrigin(0.5).setScale(0.24).setInteractive({ useHandCursor: true });

        // Эффекты наведения и нажатия для изображения-кнопки
        rudolfBtn.on('pointerover', () => {
            rudolfBtn.setScale(0.272);
        });
        rudolfBtn.on('pointerout', () => {
            rudolfBtn.setScale(0.24);
        });

        rudolfBtn.on('pointerdown', () => {
            // Создаем и запускаем музыку
            const menuMusic = this.sound.add('menu-music', { 
                loop: true, 
                volume: 0.5
            });
            menuMusic.play();
            // Переходим в главное меню
            this.scene.start('MainMenuScene');
        });

        // Обработка нажатия Enter/Return
        this.input.keyboard.on('keydown-ENTER', () => {
            rudolfBtn.emit('pointerdown');
        });
        this.input.keyboard.on('keydown-RETURN', () => {
            rudolfBtn.emit('pointerdown');
        });
    }
} 