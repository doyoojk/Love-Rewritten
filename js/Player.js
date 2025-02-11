export default class Player {
    constructor(scene, x, y, spriteKey = "player") {  // Accept spriteKey as an optional argument
        this.scene = scene;
        this.player = scene.add.image(x, y, spriteKey).setOrigin(0.5).setDepth(10);
        this.keys = scene.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });
    }

    update() {
        if (this.keys.left.isDown) {
            this.player.x -= 10;
        } else if (this.keys.right.isDown) {
            this.player.x += 10;
        }

        if (this.keys.up.isDown) {
            this.player.y -= 10;
        } else if (this.keys.down.isDown) {
            this.player.y += 10;
        }
        console.log(`Player position: (${this.player.x}, ${this.player.y})`);
    }

    destroy() {
        console.log("Player instance destroyed.");
        this.player.destroy();  // Destroy the player sprite
    }
}
