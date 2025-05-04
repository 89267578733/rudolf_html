export default class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    preload() {
        // Загрузка музыки для меню
        this.load.audio('menu-music', 'assets/01_-doomsday.mp3');
    }

    create() {
        // Добавляем черный фон
        this.add.rectangle(400, 300, 800, 600, 0x000000);

        // Добавляем музыку для меню
        this.menuMusic = this.sound.add('menu-music', { 
            loop: true, 
            volume: 0.5,
            mute: false
        });
        
        // Проверяем, не воспроизводится ли уже музыка
        if (!this.menuMusic.isPlaying) {
            this.menuMusic.play();
        }

        // Добавляем заголовок
        this.add.text(400, 100, 'Туалетные задачи', {
            fontSize: '48px',
            fill: '#fff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        // Добавляем подзаголовок
        this.add.text(400, 160, 'Рудольф решает!', {
            fontSize: '32px',
            fill: '#fff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        // Добавляем кнопку "Начать игру"
        const startButton = this.add.text(400, 300, 'Начать игру', {
            fontSize: '32px',
            fill: '#fff',
            fontFamily: 'Arial',
            backgroundColor: '#000',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setInteractive();

        // Добавляем эффект при наведении на кнопку
        startButton.on('pointerover', () => {
            startButton.setStyle({ fill: '#ff0' });
        });

        startButton.on('pointerout', () => {
            startButton.setStyle({ fill: '#fff' });
        });

        // Обработчик нажатия на кнопку
        startButton.on('pointerdown', () => {
            this.scene.start('GameScene');
        });

        // Добавляем кнопку "Таблица лидеров"
        const leaderboardButton = this.add.text(400, 360, 'Таблица лидеров', {
            fontSize: '32px',
            fill: '#fff',
            fontFamily: 'Arial',
            backgroundColor: '#000',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setInteractive();

        // Добавляем эффект при наведении на кнопку
        leaderboardButton.on('pointerover', () => {
            leaderboardButton.setStyle({ fill: '#ff0' });
        });

        leaderboardButton.on('pointerout', () => {
            leaderboardButton.setStyle({ fill: '#fff' });
        });

        // Обработчик нажатия на кнопку
        leaderboardButton.on('pointerdown', () => {
            this.scene.start('LeaderboardScene');
        });
    }
}