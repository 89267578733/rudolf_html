// import Phaser from 'phaser';
import { GAME } from '../config';
import { generateTask, difficulties } from '../utils/taskGenerator';

export default class TaskScene extends Phaser.Scene {
    constructor() {
        super({ key: 'TaskScene' });
        this.currentDifficulty = 'easy';
    }

    getDifficultyLabel(level) {
        switch (level) {
            case 'easy': return 'Лёгкая';
            case 'medium': return 'Средняя';
            case 'hard': return 'Сложная';
            case 'expert': return 'Эксперт';
            default: return level;
        }
    }

    preload() {
        // Загрузка спрайтов для сцены задачи
        this.load.spritesheet('rudolf-toilet', 'assets/rudolf_toilet.png', {
            frameWidth: 341,
            frameHeight: 512,
            startFrame: 0,
            endFrame: 5
        });
        this.load.image('toilet', 'assets/toilet.png');
        this.load.image('rudolf-toilet2', 'assets/rudolf-toilet2.png');
        this.load.audio('toilet-flush', 'assets/smooth_realistic_toilet_flush.mp3');
        this.load.audio('toilet-wrong', 'assets/toilet-wrong.mp3');
        this.load.audio('toilet-wrong2', 'assets/toilet-wrong2.mp3');
        this.load.audio('door', 'assets/door.mp3', {
            instances: 1
        });
        this.load.audio('duel', 'assets/1-the-duel-opening.mp3');
        this.load.audio('suda-rudolf', 'assets/Suda-rudolf.mp3');
    }

    create(data) {
        // Сохраняем данные игрока
        this.playerName = data.playerName;
        this.score = data.score;
        this.currentDifficulty = data.currentDifficulty || 'easy';
        this.task = generateTask(null, this.currentDifficulty);
        this.roundStartTime = data.roundStartTime || Date.now();
        this.tasksCompleted = data.tasksCompleted || 0;
        this.answerSelected = false;

        // Создаем объект клавиши вверх
        this.upKey = this.input.keyboard.addKey('UP');
        this.canPlayDoorSound = true;
        this.soundUnlocked = false;

        // Создаем звук двери
        this.doorSound = this.sound.add('door', {
            volume: 0.5
        });

        // Запускаем музыку дуэли
        this.duelMusic = this.sound.add('duel', { 
            loop: true, 
            volume: 0.5 
        });
        this.duelMusic.play();

        // Разблокируем звук при клике на сцену
        this.input.on('pointerdown', () => {
            if (!this.soundUnlocked) {
                this.sound.unlock();
                this.soundUnlocked = true;
            }
        });

        // Добавляем фон туалета
        this.add.image(400, 300, 'toilet').setScale(0.8);

        // Добавляем спрайт Рудольфа (справа)
        this.add.image(650, 400, 'rudolf-toilet2').setOrigin(0.5).setScale(0.28);

        // Добавляем фон для текста задачи
        const taskBg = this.add.rectangle(400, 150, 700, 100, 0x000000, 0.7);
        taskBg.setOrigin(0.5);

        // Добавляем текст с заданием
        this.add.text(
            400,
            150,
            `Решите задачу (Сложность: ${this.getDifficultyLabel(this.currentDifficulty)}):`,
            {
                fontSize: '32px',
                fill: '#fff',
                stroke: '#000',
                strokeThickness: 4,
                fontFamily: 'Tektur'
            }
        ).setOrigin(0.5);

        // Добавляем фон для вопроса
        const questionBg = this.add.rectangle(400, 200, 700, 50, 0x000000, 0.7);
        questionBg.setOrigin(0.5);

        // Вопрос
        this.questionText = this.add.text(400, 200, this.task.question, {
            fontSize: '20px',
            fill: '#fff',
            stroke: '#000',
            strokeThickness: 4,
            wordWrap: { width: 700 },
            fontFamily: 'Tektur'
        }).setOrigin(0.5);

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
                    this.endRound();
                }
            },
            repeat: -1
        });

        // Создаем варианты ответов
        const answers = this.generateAnswers(this.task.answer);
        const buttonHeight = 50;
        const buttonSpacing = 20;
        const startY = 350;
        const maxWidth = 600; // Максимальная ширина кнопки
        const minFontSize = 16; // Минимальный размер шрифта
        const maxFontSize = 20; // Максимальный размер шрифта

        this.answerButtons = [];
        this.answerButtonTexts = [];
        answers.forEach((answer, index) => {
            // Определяем размер шрифта в зависимости от длины текста
            let fontSize = maxFontSize;
            let tempText = this.add.text(0, 0, answer, { 
                fontSize: `${fontSize}px`,
                fontFamily: 'Tektur'
            });
            let textWidth = tempText.width;
            tempText.destroy();
            // Если текст слишком длинный, уменьшаем размер шрифта
            while (textWidth > maxWidth - 40 && fontSize > minFontSize) { // 40 - отступы по бокам
                fontSize -= 1;
                tempText = this.add.text(0, 0, answer, { 
                    fontSize: `${fontSize}px`,
                    fontFamily: 'Tektur'
                });
                textWidth = tempText.width;
                tempText.destroy();
            }

            // Создаем кнопку с адаптивной шириной
            const buttonWidth = Math.min(textWidth + 40, maxWidth);
            const button = this.add.rectangle(
                400,
                startY + index * (buttonHeight + buttonSpacing),
                buttonWidth,
                buttonHeight,
                0x222222
            ).setInteractive();

            const buttonText = this.add.text(
                400,
                startY + index * (buttonHeight + buttonSpacing),
                answer,
                { 
                    fontSize: `${fontSize}px`, 
                    fill: '#fff',
                    stroke: '#000',
                    strokeThickness: 4,
                    wordWrap: { width: buttonWidth - 20 }, // Добавляем перенос строки
                    fontFamily: 'Tektur'
                }
            ).setOrigin(0.5);

            button.on('pointerover', () => {
                if (!this.answerSelected) {
                    button.setFillStyle(0x333333);
                    buttonText.setStyle({ fill: '#ff0' });
                }
            });

            button.on('pointerout', () => {
                if (!this.answerSelected) {
                    button.setFillStyle(0x222222);
                    buttonText.setStyle({ fill: '#fff' });
                }
            });

            button.on('pointerdown', () => {
                if (!this.answerSelected) {
                    this.answerSelected = true;
                    this.checkAnswer(answer);
                }
            });

            this.answerButtons.push(button);
            this.answerButtonTexts.push(buttonText);
        });

        // --- Клавиатурная навигация по вариантам ---
        this.selectedAnswerIndex = 0;
        const highlightAnswer = (idx) => {
            this.answerButtons.forEach((btn, i) => {
                if (i === idx) {
                    btn.setFillStyle(0x444400);
                    this.answerButtonTexts[i].setStyle({ fill: '#ff0' });
                } else {
                    btn.setFillStyle(0x222222);
                    this.answerButtonTexts[i].setStyle({ fill: '#fff' });
                }
            });
        };
        highlightAnswer(this.selectedAnswerIndex);
        this.input.keyboard.on('keydown-UP', () => {
            if (this.answerSelected) return;
            this.selectedAnswerIndex = (this.selectedAnswerIndex + answers.length - 1) % answers.length;
            highlightAnswer(this.selectedAnswerIndex);
        });
        this.input.keyboard.on('keydown-DOWN', () => {
            if (this.answerSelected) return;
            this.selectedAnswerIndex = (this.selectedAnswerIndex + 1) % answers.length;
            highlightAnswer(this.selectedAnswerIndex);
        });
        this.input.keyboard.on('keydown-ENTER', () => {
            if (this.answerSelected) return;
            this.answerButtons[this.selectedAnswerIndex].emit('pointerdown');
        });
        this.input.keyboard.on('keydown-RETURN', () => {
            if (this.answerSelected) return;
            this.answerButtons[this.selectedAnswerIndex].emit('pointerdown');
        });
    }

    generateAnswers(correctAnswer) {
        // Если у задачи есть поле options — используем его
        if (this.task.options && Array.isArray(this.task.options)) {
            // Перемешиваем варианты
            const shuffled = [...this.task.options];
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }
            return shuffled;
        }
        // Иначе fallback на старую логику
        const answers = [correctAnswer];
        if (this.task.type === 'bug') {
            if (!isNaN(correctAnswer)) {
                const num = parseInt(correctAnswer);
                answers.push((num + 1).toString(), (num - 1).toString(), (num * 2).toString());
            } else if (correctAnswer === 'true' || correctAnswer === 'false') {
                answers.push('false', 'undefined', 'null');
            } else if (correctAnswer === 'undefined') {
                answers.push('null', 'NaN', 'false');
            } else if (correctAnswer === 'null') {
                answers.push('undefined', 'NaN', 'false');
            } else if (correctAnswer === 'NaN') {
                answers.push('undefined', 'null', 'false');
            } else {
                answers.push('true', 'false', 'undefined');
            }
        }
        const parts = correctAnswer.split(' ');
        const wrongQueries = [
            `${parts[0]} ${parts[1]} * FROM ${parts[3]};`,
            `${parts[0]} * FROM ${parts[3]} WHERE 1=1;`,
            `${parts[0]} ${parts[1]} FROM ${parts[3]} LIMIT 1;`
        ];
        answers.push(...wrongQueries);
        if (this.task.type === 'prioritization') {
            const wrongOptions = [
                'оптимизировать UI',
                'добавить анимации',
                'улучшить документацию'
            ];
            answers.push(...wrongOptions);
        } else if (this.task.type === 'algorithm') {
            if (!isNaN(correctAnswer)) {
                const num = parseInt(correctAnswer);
                const wrongNumbers = [
                    (num + 1).toString(),
                    (num - 1).toString(),
                    (num * 2).toString()
                ];
                answers.push(...wrongNumbers);
            } else {
                const wrongComplexities = [
                    'O(n)',
                    'O(n²)',
                    'O(log n)'
                ];
                answers.push(...wrongComplexities);
            }
        }
        for (let i = answers.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [answers[i], answers[j]] = [answers[j], answers[i]];
        }
        return answers;
    }

    checkAnswer(answer) {
        const correctAnswer = this.task.answer.toLowerCase();
        const userAnswer = answer.toLowerCase();

        if (userAnswer === correctAnswer) {
            this.tasksCompleted++;
            // Увеличиваем сложность при правильном ответе
            const currentIndex = difficulties.indexOf(this.currentDifficulty);
            if (currentIndex < difficulties.length - 1) {
                this.currentDifficulty = difficulties[currentIndex + 1];
            }
            this.showResult('СЮЮЮЮЮЮЮДА', true);
        } else {
            // Воспроизводим звук неправильного ответа
            this.sound.play('toilet-wrong2');
            this.showResult('Вы насрали в руки', false);
        }
    }

    failTask() {
        this.showResult('Вы насрали в руки', false);
    }

    showResult(message, success) {
        this.timer.remove();
        this.duelMusic.stop(); // Останавливаем музыку дуэли

        if (success) {
            this.sound.play('suda-rudolf');
        }

        const bg = this.add.rectangle(400, 450, 400, 60, success ? 0x006600 : 0x8B4513, 0.8);
        const resultText = this.add.text(400, 450, message, {
            fontSize: '28px',
            fill: success ? '#fff' : '#000'
        }).setOrigin(0.5);

        this.time.delayedCall(2000, () => {
            if (success) {
                this.scene.start('TaskScene', { 
                    playerName: this.playerName, 
                    score: this.score,
                    roundStartTime: this.roundStartTime,
                    tasksCompleted: this.tasksCompleted,
                    currentDifficulty: this.currentDifficulty
                });
            } else {
                this.endRound();
            }
        });
    }

    endRound() {
        this.duelMusic.stop(); // Останавливаем музыку дуэли
        // Запускаем музыку главного меню после окончания звука неправильного ответа
        const menuMusic = this.sound.add('menu-music', { 
            loop: true, 
            volume: 0.5
        });
        menuMusic.play();
        
        this.scene.start('LeaderboardScene', { 
            playerName: this.playerName, 
            score: this.tasksCompleted 
        });
    }

    shutdown() {
        if (this.answerInput) {
            this.answerInput.remove();
        }
        if (this.duelMusic) {
            this.duelMusic.stop();
        }
    }

    update() {
        // Обработка нажатия клавиши вверх
        if (this.upKey.isDown && this.canPlayDoorSound && this.soundUnlocked) {
            if (this.doorSound) {
                this.doorSound.play();
            }
            this.canPlayDoorSound = false;
        } else if (this.upKey.isUp) {
            this.canPlayDoorSound = true;
        }
    }
} 