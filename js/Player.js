export default class Player {
    constructor(scene, x, y) {
        this.scene = scene;

        // Add the player sprite using the sprite sheet, set the initial frame.
        this.player = scene.physics.add.sprite(x, y, "player_spritesheet").setOrigin(0.5).setDepth(10);

        this.keys = scene.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });

        // Create animations using the sprite sheet
        this.createAnimations();
    }

    createAnimations() {
        this.scene.anims.create({
            key: 'walk_up',
            frames: this.scene.anims.generateFrameNumbers('player_spritesheet', { start: 1, end: 1 }),
            frameRate: 10,
            repeat: -1
        });

        this.scene.anims.create({
            key: 'walk_right',
            frames: this.scene.anims.generateFrameNumbers('player_spritesheet', { start: 4, end: 5 }),
            frameRate: 10,
            repeat: -1
        });

        this.scene.anims.create({
            key: 'walk_down',
            frames: this.scene.anims.generateFrameNumbers('player_spritesheet', { start: 0, end: 0 }),
            frameRate: 10,
            repeat: -1
        });

        this.scene.anims.create({
            key: 'walk_left',
            frames: this.scene.anims.generateFrameNumbers('player_spritesheet', { start: 2, end: 3 }),
            frameRate: 10,
            repeat: -1
        });
    }

    update() {
        const playerSpeed = 160;
        let moving = false;

        if (this.keys.left.isDown) {
            this.player.setVelocityX(-playerSpeed);
            this.player.play('walk_left', true);
            moving = true;
        } else if (this.keys.right.isDown) {
            this.player.setVelocityX(playerSpeed);
            this.player.play('walk_right', true);
            moving = true;
        } else {
            this.player.setVelocityX(0);
        }

        if (this.keys.up.isDown) {
            this.player.setVelocityY(-playerSpeed);
            this.player.play('walk_up', true);
            moving = true;
        } else if (this.keys.down.isDown) {
            this.player.setVelocityY(playerSpeed);
            this.player.play('walk_down', true);
            moving = true;
        } else {
            this.player.setVelocityY(0);
        }

        if (!moving) {
            this.player.stop();  // Stop animation when not moving
        }
    }

    destroy() {
        console.log("Player instance destroyed.");
        this.player.destroy();
    }
}
