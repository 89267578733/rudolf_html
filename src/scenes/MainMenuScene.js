import { difficulties } from '../utils/taskGenerator';

export default class MainMenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenuScene' });
    }

    preload() {
        this.load.audio('menu-music', 'assets/menu-music.mp3');
        this.load.image('play', 'assets/play.png');
        // Загрузка спрайтов мерцания
        this.load.image('cubicle-flicker-1', 'assets/cubicle_flicker_1.png');
        this.load.image('cubicle-flicker-2', 'assets/cubicle_flicker_2.png');
        this.load.image('cubicle-flicker-3', 'assets/cubicle_flicker_3.png');
    }

    create() {
        // Фон: мерцание из трёх спрайтов
        this.flickerImages = [
            this.add.image(400, 300, 'cubicle-flicker-1').setScale(0.6),
            this.add.image(400, 300, 'cubicle-flicker-2').setScale(0.6),
            this.add.image(400, 300, 'cubicle-flicker-3').setScale(0.6)
        ];
        this.flickerImages.forEach((img, index) => {
            if (index !== 0) img.setVisible(false);
        });
        this.time.addEvent({
            delay: 5000,
            callback: this.startFlicker,
            callbackScope: this,
            loop: true
        });

        // Создаем поле ввода
        this.nameInput = document.createElement('input');
        this.nameInput.type = 'text';
        this.nameInput.placeholder = 'Введите имя игрока...';
        this.nameInput.style.position = 'absolute';
        this.nameInput.style.left = '50%';
        this.nameInput.style.top = '50%';
        this.nameInput.style.transform = 'translate(-50%, -50%)';
        this.nameInput.style.width = '300px';
        this.nameInput.style.height = '40px';
        this.nameInput.style.fontSize = '20px';
        this.nameInput.style.textAlign = 'center';
        this.nameInput.style.border = '2px solid #fff';
        this.nameInput.style.borderRadius = '5px';
        this.nameInput.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        this.nameInput.style.color = '#fff';
        this.nameInput.style.outline = 'none';
        this.nameInput.style.transition = 'all 0.3s ease';
        this.nameInput.style.setProperty('::placeholder', 'color: #fff !important');
        this.nameInput.style.fontFamily = 'Tektur';
        document.body.appendChild(this.nameInput);
        this.nameInput.focus();

        // Создаем кнопку генерации имени
        const buttonRadius = 25;
        const buttonX = 400 + 200; // Увеличиваем отступ от центра (было 180)
        const buttonY = 300; // Центр экрана
        
        // Создаем графику для кнопки
        const buttonGraphics = this.add.graphics();
        buttonGraphics.clear();
        buttonGraphics.lineStyle(2, 0xffffff); // Только белая обводка
        buttonGraphics.fillStyle(0x333333);
        buttonGraphics.fillCircle(buttonX, buttonY, buttonRadius);
        buttonGraphics.strokeCircle(buttonX, buttonY, buttonRadius);
        
        // Добавляем текст на кнопку
        const generateButton = this.add.text(buttonX, buttonY, '🎲', {
            fontSize: '24px',
            fill: '#fff',
            fontFamily: 'Tektur'
        }).setOrigin(0.5);

        // Создаем зону для взаимодействия
        const buttonZone = this.add.zone(buttonX, buttonY, buttonRadius * 2, buttonRadius * 2)
            .setOrigin(0.5)
            .setInteractive();

        buttonZone.on('pointerover', () => {
            buttonGraphics.clear();
            buttonGraphics.lineStyle(2, 0xffffff); // Сохраняем обводку при наведении
            buttonGraphics.fillStyle(0x444444);
            buttonGraphics.fillCircle(buttonX, buttonY, buttonRadius);
            buttonGraphics.strokeCircle(buttonX, buttonY, buttonRadius);
            generateButton.setScale(1.1);
        });

        buttonZone.on('pointerout', () => {
            buttonGraphics.clear();
            buttonGraphics.lineStyle(2, 0xffffff); // Сохраняем обводку при выходе
            buttonGraphics.fillStyle(0x333333);
            buttonGraphics.fillCircle(buttonX, buttonY, buttonRadius);
            buttonGraphics.strokeCircle(buttonX, buttonY, buttonRadius);
            generateButton.setScale(1);
        });

        buttonZone.on('pointerdown', () => {
            const names = [
                'Китяра',
                'Сигма-Кит',
                'Моби Дик',
                'Кит-Повелитель',
                'Кит-Гигачад',
                'Кит-Альфа',
                'Кит-Омега',
                'Кит-Легенда',
                'Кит-Мастер',
                'Кит-Босс',
                'Кит-Титан',
                'Кит-Властелин',
                'Кит-Император',
                'Кит-Король',
                'Кит-Повелитель морей',
                'Кит-Великий',
                'Кит-Повелитель волн',
                'Кит-Хранитель',
                'Кит-Защитник',
                'Кит-Мудрец',
                'Кит-Воин',
                'Кит-Повелитель глубин',
                'Кит-Странник',
                'Кит-Искатель',
                'Кит-Покоритель',
                'Кит-Повелитель течений',
                'Кит-Хранитель тайн',
                'Кит-Повелитель стихий',
                'Кит-Владыка океана',
                'Кит-Повелитель приливов'
            ];
            const randomName = names[Math.floor(Math.random() * names.length)];
            this.nameInput.value = randomName;
            this.updateStartButtonState();
        });

        // Добавляем кнопку старта (изначально невидима)
        this.startButton = this.add.image(400, 400, 'play').setInteractive().setVisible(false);
        this.startButton.setScale(0.167); // Уменьшаем размер в 3 раза

        this.startButton.on('pointerover', () => {
            this.startButton.setScale(0.183); // Немного увеличиваем при наведении
        });

        this.startButton.on('pointerout', () => {
            this.startButton.setScale(0.167); // Возвращаем исходный размер
        });

        this.startButton.on('pointerdown', () => {
            if (this.nameInput.value.trim() === '') {
                alert('Пожалуйста, введите имя или сгенерируйте его!');
                return;
            }
            // Останавливаем музыку перед переходом
            if (this.sound.get('menu-music')) {
                this.sound.get('menu-music').stop();
            }
            this.scene.start('GameScene', { 
                playerName: this.nameInput.value,
                currentDifficulty: difficulties[0] // Передаем начальный уровень сложности
            });
        });

        // Добавляем обработчики для очистки input при уничтожении сцены
        this.events.on('shutdown', this.shutdown, this);
        this.events.on('destroy', this.shutdown, this);

        // Обновляем состояние кнопки при вводе текста
        this.nameInput.addEventListener('input', () => this.updateStartButtonState());
        this.updateStartButtonState();

        // --- Клавиатурная навигация ---
        this.selectedButtonIndex = 0; // 0 - генерация, 1 - старт
        const buttons = [buttonZone, this.startButton];
        const highlightButton = (idx) => {
            if (idx === 0) {
                buttonGraphics.clear();
                buttonGraphics.lineStyle(2, 0xffffff); // только белая обводка
                buttonGraphics.fillStyle(0x444444);
                buttonGraphics.fillCircle(buttonX, buttonY, buttonRadius);
                buttonGraphics.strokeCircle(buttonX, buttonY, buttonRadius);
                generateButton.setScale(1.2);
                this.startButton.setScale(0.167);
            } else {
                buttonGraphics.clear();
                buttonGraphics.lineStyle(2, 0xffffff);
                buttonGraphics.fillStyle(0x333333);
                buttonGraphics.fillCircle(buttonX, buttonY, buttonRadius);
                buttonGraphics.strokeCircle(buttonX, buttonY, buttonRadius);
                generateButton.setScale(1);
                this.startButton.setScale(0.183);
            }
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
            if (this.selectedButtonIndex === 0) {
                buttonZone.emit('pointerdown');
            } else {
                this.startButton.emit('pointerdown');
            }
        });
        this.input.keyboard.on('keydown-RETURN', () => {
            if (this.selectedButtonIndex === 0) {
                buttonZone.emit('pointerdown');
            } else {
                this.startButton.emit('pointerdown');
            }
        });
    }

    updateStartButtonState() {
        const hasName = this.nameInput.value.trim() !== '';
        this.startButton.setVisible(hasName);
    }

    shutdown() {
        // Удаляем поле ввода при уничтожении сцены
        if (this.nameInput) {
            this.nameInput.remove();
        }
    }

    startFlicker() {
        const nextFlickerDelay = Phaser.Math.Between(3000, 7000);
        this.time.addEvent({
            delay: 50,
            callback: () => {
                this.flickerImages[0].setVisible(false);
                this.flickerImages[1].setVisible(true);
            }
        });
        this.time.addEvent({
            delay: 100,
            callback: () => {
                this.flickerImages[1].setVisible(false);
                this.flickerImages[2].setVisible(true);
            }
        });
        this.time.addEvent({
            delay: 150,
            callback: () => {
                this.flickerImages[2].setVisible(false);
                this.flickerImages[0].setVisible(true);
            }
        });
        this.time.addEvent({
            delay: nextFlickerDelay,
            callback: this.startFlicker,
            callbackScope: this
        });
    }
} 