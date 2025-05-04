export const config = {
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

// Game constants
export const GAME = {
    ROUND_TIME_LIMIT: 60000, // 1 минута в миллисекундах
    CUBICLE_COUNT: 5,
    PLAYER_SPEED: 200,
    TASK_TYPES: ['bug', 'sql', 'prioritization', 'algorithm', 'go-syntax', 'go-stdlib', 'go-concurrency', 'go-idioms']
}; 