export default class Player {
    constructor(scene, x, y) {
        this.scene = scene;
        this.player = scene.add.image(x, y, "colby").setOrigin(0.5);  // Use as a static image
        console.log("Player image loaded");
        this.cursors = scene.input.keyboard.createCursorKeys();
    }

    update() {
        if (this.cursors.left.isDown) {
            this.player.x -= 10;
        } else if (this.cursors.right.isDown) {
            this.player.x += 10;
        }

        if (this.cursors.up.isDown) {
            this.player.y -= 10;
        } else if (this.cursors.down.isDown) {
            this.player.y += 10;
        }
    }
}
