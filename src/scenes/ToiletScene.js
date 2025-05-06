export default class ToiletScene extends Phaser.Scene {
    constructor() {
        super({ key: 'ToiletScene' });
    }

    preload() {
        this.load.image('toilet', 'assets/toilet.png');
        this.load.image('rudolf-walk2', 'assets/rudolf-walk2.png');
        this.load.image('developer', 'assets/developer.png');
        this.load.audio('oops', 'assets/oops.mp3');
        this.load.image('out', 'assets/out.png');
        this.load.image('wash', 'assets/wash.png');
        this.load.audio('toilet-correct', 'assets/toilet-correct.mp3');
    }

    create(data) {
        // Добавляем фон туалета
        this.add.image(400, 300, 'toilet').setScale(0.8);

        // Добавляем текст сверху по центру
        const topTextBg = this.add.rectangle(400, 50, 700, 48, 0x000000, 0.7).setOrigin(0.5);
        this.add.text(400, 50, 'Эта кабинка уже занята. Найди свободную кабинку', {
            fontSize: '24px',
            fill: '#fff',
            fontFamily: 'Arial',
            align: 'center'
        }).setOrigin(0.5);

        // Добавляем спрайт Рудольфа (слева внизу)
        this.add.image(150, 370, 'rudolf-walk2').setOrigin(0.5).setScale(0.335);

        // Добавляем спрайт разработчика
        this.developer = this.add.sprite(650, 400, 'developer');
        this.developer.setScale(0.4);

        // Воспроизводим звук
        this.sound.play('oops');

        // Кнопка wash над кнопкой out
        this.washButton = this.add.image(400, 400, 'wash').setInteractive();
        this.washButton.setScale(0.167);
        this.washButton.on('pointerover', () => {
            this.washButton.setScale(0.183);
        });
        this.washButton.on('pointerout', () => {
            this.washButton.setScale(0.167);
        });

        // Кнопка out
        this.exitButton = this.add.image(400, 520, 'out').setInteractive();
        this.exitButton.setScale(0.167);
        this.exitButton.on('pointerover', () => {
            this.exitButton.setScale(0.183);
        });
        this.exitButton.on('pointerout', () => {
            this.exitButton.setScale(0.167);
        });
        this.exitButton.on('pointerdown', () => {
            this.scene.start('GameScene', {
                playerName: data.playerName,
                score: data.score,
                roundStartTime: data.roundStartTime,
                hasVisitedToilet: true,
                currentDifficulty: data.currentDifficulty
            });
        });

        // --- Клавиатурная навигация между кнопками ---
        this.selectedButtonIndex = 0; // 0 - wash, 1 - out
        const buttons = [this.washButton, this.exitButton];
        const highlightButton = (idx) => {
            buttons.forEach((btn, i) => {
                if (i === idx) {
                    btn.setScale(0.19);
                } else {
                    btn.setScale(0.167);
                }
            });
        };
        highlightButton(this.selectedButtonIndex);
        this.input.keyboard.on('keydown-UP', () => {
            this.selectedButtonIndex = (this.selectedButtonIndex + buttons.length - 1) % buttons.length;
            highlightButton(this.selectedButtonIndex);
        });
        this.input.keyboard.on('keydown-DOWN', () => {
            this.selectedButtonIndex = (this.selectedButtonIndex + 1) % buttons.length;
            highlightButton(this.selectedButtonIndex);
        });
        this.input.keyboard.on('keydown-ENTER', () => {
            buttons[this.selectedButtonIndex].emit('pointerdown');
        });
        this.input.keyboard.on('keydown-RETURN', () => {
            buttons[this.selectedButtonIndex].emit('pointerdown');
        });
    }
} 