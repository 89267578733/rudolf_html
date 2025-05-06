export default class StartScene extends Phaser.Scene {
    constructor() {
        super({ key: 'StartScene' });
    }

    preload() {
        // Загрузка музыки для меню
        this.load.audio('menu-music', 'assets/01_-doomsday.mp3');
        this.load.audio('toilet-wrong2', 'assets/toilet-wrong2.mp3');
        this.load.image('rudolf-toilet2', 'assets/rudolf-toilet2.png');
        // Загрузка спрайтов мерцания
        this.load.image('cubicle-flicker-1', 'assets/cubicle_flicker_1.png');
        this.load.image('cubicle-flicker-2', 'assets/cubicle_flicker_2.png');
        this.load.image('cubicle-flicker-3', 'assets/cubicle_flicker_3.png');
    }

    create() {
        // Создаем анимацию мерцания
        this.flickerImages = [
            this.add.image(400, 300, 'cubicle-flicker-1').setScale(0.6),
            this.add.image(400, 300, 'cubicle-flicker-2').setScale(0.6),
            this.add.image(400, 300, 'cubicle-flicker-3').setScale(0.6)
        ];
        
        // Скрываем все изображения кроме первого
        this.flickerImages.forEach((img, index) => {
            if (index !== 0) img.setVisible(false);
        });
        
        // Создаем таймер для анимации мерцания
        this.time.addEvent({
            delay: 5000, // Начальная задержка перед первым мерцанием (5 секунд)
            callback: this.startFlicker,
            callbackScope: this,
            loop: true
        });

        // Добавляем изображение Рудольфа как кнопку
        const rudolfBtn = this.add.image(400, 380, 'rudolf-toilet2').setOrigin(0.5).setScale(0.252).setInteractive({ useHandCursor: true });

        let hoverSoundInstance = null;
        // Эффекты наведения и нажатия для изображения-кнопки
        rudolfBtn.on('pointerover', () => {
            rudolfBtn.setScale(0.277); // Увеличиваем на 10% при наведении
            if (!hoverSoundInstance || !hoverSoundInstance.isPlaying) {
                hoverSoundInstance = this.sound.add('toilet-wrong2');
                hoverSoundInstance.play();
            }
        });
        rudolfBtn.on('pointerout', () => {
            rudolfBtn.setScale(0.252); // Возвращаем исходный размер
            if (hoverSoundInstance && hoverSoundInstance.isPlaying) {
                hoverSoundInstance.stop();
            }
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

        // Разблокировка аудиоконтекста при первом пользовательском действии
        const unlockAudio = () => {
            if (this.sound && this.sound.context && this.sound.context.state === 'suspended') {
                this.sound.context.resume();
            }
            this.input.off('pointerdown', unlockAudio);
            this.input.keyboard.off('keydown', unlockAudio);
        };
        this.input.on('pointerdown', unlockAudio);
        this.input.keyboard.on('keydown', unlockAudio);

        // Обработка нажатия Enter/Return
        this.input.keyboard.on('keydown-ENTER', () => {
            rudolfBtn.emit('pointerdown');
        });
        this.input.keyboard.on('keydown-RETURN', () => {
            rudolfBtn.emit('pointerdown');
        });
    }

    startFlicker() {
        // Случайная задержка перед следующим мерцанием (от 3 до 7 секунд)
        const nextFlickerDelay = Phaser.Math.Between(3000, 7000);
        
        // Создаем последовательность мерцаний
        this.time.addEvent({
            delay: 50, // Первый кадр
            callback: () => {
                this.flickerImages[0].setVisible(false);
                this.flickerImages[1].setVisible(true);
            }
        });

        this.time.addEvent({
            delay: 100, // Второй кадр
            callback: () => {
                this.flickerImages[1].setVisible(false);
                this.flickerImages[2].setVisible(true);
            }
        });

        this.time.addEvent({
            delay: 150, // Третий кадр
            callback: () => {
                this.flickerImages[2].setVisible(false);
                this.flickerImages[0].setVisible(true);
            }
        });

        // Устанавливаем задержку до следующего мерцания
        this.time.addEvent({
            delay: nextFlickerDelay,
            callback: this.startFlicker,
            callbackScope: this
        });
    }
} 