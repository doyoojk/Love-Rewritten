export default class Player {
    constructor(scene, x, y) {
        this.scene = scene;
        this.player = scene.add.image(x, y, "player").setOrigin(0.5);
        this.keys = scene.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });
    }

    update() {
        if (this.keys.left.isDown) {
            this.player.x -= 25;
        } else if (this.keys.right.isDown) {
            this.player.x += 25;
        }

        if (this.keys.up.isDown) {
            this.player.y -= 25;
        } else if (this.keys.down.isDown) {
            this.player.y += 25;
        }
    }

    destroy() {
        console.log("Player instance destroyed.");
        this.player.destroy();  // Destroy the player sprite
    }
}
