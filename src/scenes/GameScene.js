// import Phaser from 'phaser';
import { GAME } from '../config';
import { difficulties } from '../utils/taskGenerator';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    preload() {
        // Загрузка спрайтов
        this.load.spritesheet('rudolf-walk', 'assets/rudolf-walk.png', {
            frameWidth: 341,
            frameHeight: 512,
            startFrame: 0,
            endFrame: 5
        });
        this.load.image('rudolf-toilet', 'assets/rudolf_toilet.png');
        this.load.image('office-corridor', 'assets/office-corridor2.png');
        this.load.image('toilet', 'assets/toilet.png');
        this.load.image('developer', 'assets/developer.png');
        
        // Загрузка звуков
        this.load.audio('toilet-flush', 'assets/smooth_realistic_toilet_flush.mp3');
        this.load.audio('office-steps', 'assets/office_steps_background.mp3');
    }

    create(data) {
        // Создаем группу для всех движущихся элементов
        this.movingElements = this.add.group();
        
        // Создаем несколько копий фона
        this.backgrounds = [];
        const bgWidth = 800; // Ширина одного фона
        const bgCount = 3; // Количество копий фона
        
        for (let i = 0; i < bgCount; i++) {
            const bg = this.add.image(i * bgWidth, 300, 'office-corridor');
            bg.setScale(0.8);
            this.backgrounds.push(bg);
            this.movingElements.add(bg);
        }
        
        this.playerName = data.playerName || localStorage.getItem('playerName') || 'Гость';
        this.score = data.score || 0;
        this.roundStartTime = data.roundStartTime || Date.now();
        this.hasVisitedToilet = data.hasVisitedToilet || false;
        this.currentDifficulty = data.currentDifficulty || difficulties[0];

        // Добавляем фон для таймера
        const timerBg = this.add.rectangle(700, 16, 200, 40, 0x000000, 0.7);
        timerBg.setOrigin(1, 0);

        // Таймер раунда
        this.timeLeft = Math.max(0, Math.floor((this.roundStartTime + GAME.ROUND_TIME_LIMIT - Date.now()) / 1000));
        this.timerText = this.add.text(700, 16, `Время: ${this.timeLeft}`, {
            fontSize: '20px',
            fill: '#ff0',
            stroke: '#000',
            strokeThickness: 4,
            fontFamily: 'Tektur'
        }).setOrigin(1, 0);

        // Обновление таймера
        this.timer = this.time.addEvent({
            delay: 1000,
            callback: () => {
                this.timeLeft = Math.max(0, Math.floor((this.roundStartTime + GAME.ROUND_TIME_LIMIT - Date.now()) / 1000));
                this.timerText.setText(`Время: ${this.timeLeft}`);
                
                if (this.timeLeft <= 0) {
                    this.scene.start('LeaderboardScene', { 
                        playerName: this.playerName, 
                        score: this.score 
                    });
                }
            },
            repeat: -1
        });

        // Создание анимации ходьбы Рудольфа (только если не существует)
        if (!this.anims.exists('walk')) {
            this.anims.create({
                key: 'walk',
                frames: this.anims.generateFrameNumbers('rudolf-walk', { start: 0, end: 5 }),
                frameRate: 10,
                repeat: -1
            });
        }

        // Игрок (фиксированная позиция)
        this.player = this.add.sprite(400, 380, 'rudolf-walk');
        this.player.setScale(0.72);
        this.player.setAlpha(0.8);
        this.player.anims.play('walk');

        // Звук шагов
        this.stepsSound = this.sound.add('office-steps', { loop: true, volume: 0.5 });
        this.isMoving = false;

        // Управление
        this.cursors = this.input.keyboard.createCursorKeys();

        // Подсказка управления (не добавляем в movingElements)
        const controlsBg = this.add.rectangle(400, 580, 400, 30, 0x000000, 0.5);
        const controlsText = this.add.text(400, 580, '← → — движение, ↑ — войти в кабинку', {
            fontSize: '18px',
            fill: '#fff',
            fontFamily: 'Tektur'
        }).setOrigin(0.5);

        // Установка границ для камеры
        this.cameras.main.setBounds(0, 0, 2000, 600);
    }

    update() {
        // Движение фона
        if (this.cursors.left.isDown) {
            this.backgrounds.forEach(bg => {
                bg.x += GAME.PLAYER_SPEED * 0.1;
                // Если фон ушел за пределы видимости, перемещаем его в конец
                if (bg.x > 2400) {
                    bg.x -= 2400;
                }
            });
            this.player.setFlipX(true);
            this.player.anims.play('walk', true);
            if (!this.isMoving) {
                this.stepsSound.play();
                this.isMoving = true;
            }
        } else if (this.cursors.right.isDown) {
            this.backgrounds.forEach(bg => {
                bg.x -= GAME.PLAYER_SPEED * 0.1;
                // Если фон ушел за пределы видимости, перемещаем его в начало
                if (bg.x < -800) {
                    bg.x += 2400;
                }
            });
            this.player.setFlipX(false);
            this.player.anims.play('walk', true);
            if (!this.isMoving) {
                this.stepsSound.play();
                this.isMoving = true;
            }
        } else {
            this.player.anims.stop();
            if (this.isMoving) {
                this.stepsSound.stop();
                this.isMoving = false;
            }
        }

        // Проверка нажатия стрелки вверх для смены сцены
        if (this.cursors.up.isDown) {
            if (!this.hasVisitedToilet) {
                // Если еще не были в туалете в этом раунде, идем в ToiletScene
                this.scene.start('ToiletScene', { 
                    playerName: this.playerName, 
                    score: this.score,
                    roundStartTime: this.roundStartTime,
                    hasVisitedToilet: true,
                    currentDifficulty: this.currentDifficulty
                });
            } else {
                // Если уже были в туалете, идем в TaskScene
                this.scene.start('TaskScene', { 
                    playerName: this.playerName, 
                    score: this.score,
                    roundStartTime: this.roundStartTime,
                    hasVisitedToilet: true,
                    currentDifficulty: this.currentDifficulty
                });
            }
        }
    }
} 