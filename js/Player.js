export default class Player {
    constructor(scene, x, y) {
        this.scene = scene;
        this.player = scene.add.image(x, y, "player").setOrigin(0.5).setDepth(10);
        this.keys = scene.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });
    }

    update() {
        if (this.keys.left.isDown) {
            this.player.x = Math.max(this.player.x - 6, 50);  
        } else if (this.keys.right.isDown) {
            this.player.x = Math.min(this.player.x + 6, 1736);  
        }

        if (this.keys.up.isDown) {
            this.player.y = Math.max(this.player.y - 6, 115);  
        } else if (this.keys.down.isDown) {
            this.player.y = Math.min(this.player.y + 6, 913);  
        }
        console.log("player position: " + this.player.x + ", " + this.player.y);
    }

    destroy() {
        console.log("Player instance destroyed.");
        this.player.destroy();
    }
}
