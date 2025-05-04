// import Phaser from 'phaser';

function saveScore(name, score) {
    let records = JSON.parse(localStorage.getItem('toilet_leaderboard') || '[]');
    // Фильтруем записи гостей
    records = records.filter(record => record.name !== 'Гость');
    records.push({ name, score });
    records = records.sort((a, b) => b.score - a.score);
    localStorage.setItem('toilet_leaderboard', JSON.stringify(records));
    return records;
}

export default class LeaderboardScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LeaderboardScene' });
    }

    preload() {
        this.load.audio('02-wilderness', 'assets/02-wilderness.mp3');
        this.load.image('hand', 'assets/hand.png');
        this.load.audio('five', 'assets/five.mp3');
        this.load.image('play_again', 'assets/play_again.png');
        this.load.image('crown', 'assets/crown.png');
        this.load.image('fame', 'assets/fame.png');
    }

    create(data) {
        // Останавливаем все звуки
        this.sound.stopAll();

        // Запускаем звук wilderness
        this.wildernessSound = this.sound.add('02-wilderness', { 
            loop: true, 
            volume: 0.5 
        });
        this.wildernessSound.play();

        // Добавляем фон
        this.add.image(400, 300, 'fame').setScale(0.8);

        // Добавляем изображение руки (1/16 экрана) слева и делаем его интерактивным
        const hand = this.add.image(150, 100, 'hand').setScale(0.05).setInteractive();
        
        // Добавляем эффект при наведении
        hand.on('pointerover', () => {
            this.tweens.add({
                targets: hand,
                scale: 0.32,
                duration: 150,
                ease: 'Sine.easeOut'
            });
        });

        hand.on('pointerout', () => {
            this.tweens.add({
                targets: hand,
                scale: 0.05,
                duration: 150,
                ease: 'Sine.easeOut'
            });
        });

        // Добавляем звук при клике
        hand.on('pointerdown', () => {
            this.sound.play('five');
        });

        this.playerName = data.playerName;
        this.score = data.score || 0;
        const records = saveScore(this.playerName, this.score);

        // Фон для заголовка
        const titleBg = this.add.rectangle(400, 80, 300, 50, 0x000000, 0.6);
        titleBg.setOrigin(0.5);
        // Заголовок
        this.add.text(400, 80, 'ТОП 5 игроков', {
            fontSize: '32px',
            fill: '#fff',
            fontFamily: 'Tektur'
        }).setOrigin(0.5);

        // Фон для результата игрока
        const playerScoreBg = this.add.rectangle(400, 140, 400, 40, 0x000000, 0.6);
        playerScoreBg.setOrigin(0.5);
        // Результат игрока
        this.add.text(400, 140, `Ваш результат: ${this.score}`, {
            fontSize: '24px',
            fill: '#0f0',
            fontFamily: 'Tektur'
        }).setOrigin(0.5);

        // Топ-5
        records.slice(0, 5).forEach((rec, i) => {
            const color = rec.name === this.playerName && rec.score === this.score ? '#0f0' : '#fff';
            const y = 200 + i * 32;
            // Фон для каждой строки
            const rowBg = this.add.rectangle(400, y + 10, 420, 32, 0x000000, 0.6).setOrigin(0.5);
            const textObj = this.add.text(300, y, `${i + 1}. ${rec.name}: ${rec.score}`, {
                fontSize: '24px',
                fill: color,
                fontFamily: 'Tektur'
            });
            // Если это первое место, добавляем корону
            if (i === 0) {
                this.add.image(260, y + 10, 'crown').setScale(0.0432).setOrigin(0.5, 0.5);
            }
        });

        // Позиция игрока, если он не в топ-5
        const playerPosition = records.findIndex(rec => rec.name === this.playerName && rec.score === this.score);
        if (playerPosition >= 5) {
            // Фон для позиции игрока
            const playerPosBg = this.add.rectangle(400, 360, 420, 32, 0x000000, 0.6).setOrigin(0.5);
            this.add.text(300, 360, `${playerPosition + 1}. ${this.playerName}: ${this.score}`, {
                fontSize: '24px',
                fill: '#0f0',
                fontFamily: 'Tektur'
            });
        }

        // Кнопка "Играть снова"
        const playAgainButton = this.add.image(400, 500, 'play_again').setInteractive();
        playAgainButton.setScale(0.167); // Такой же размер, как у кнопки play в главном меню

        playAgainButton.on('pointerover', () => {
            playAgainButton.setScale(0.183); // Немного увеличиваем при наведении
        });

        playAgainButton.on('pointerout', () => {
            playAgainButton.setScale(0.167); // Возвращаем исходный размер
        });

        playAgainButton.on('pointerdown', () => {
            // Останавливаем звук wilderness перед переходом
            if (this.wildernessSound) {
                this.wildernessSound.stop();
            }
            this.scene.start('GameScene', { 
                playerName: this.playerName, 
                score: 0,
                currentDifficulty: 'easy',
                hasVisitedToilet: true // Добавляем флаг, что игрок уже был в туалете
            });
        });
    }

    shutdown() {
        // Останавливаем звук wilderness при выходе из сцены
        if (this.wildernessSound) {
            this.wildernessSound.stop();
        }
    }
} 