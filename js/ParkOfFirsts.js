import Player from './Player.js';

class ParkOfFirsts extends Phaser.Scene {
    constructor() {
        super({ key: "ParkOfFirsts" });
    }

    preload() {
        this.load.image("background", "data/lake.png");
        this.load.image("colby", "data/colby.jpg");
        this.load.image("object", "data/lake_zone.png");
    }

    create() {
        this.add.image(896, 511, "background").setDisplaySize(1792, 1022);

        // Create player
        this.player = new Player(this, 100, 100);

        // Add interactive object (lake zone)
        this.object = this.physics.add.sprite(400, 300, "object").setInteractive();
        
        // Check for interaction
        this.physics.add.overlap(this.player.player, this.object, this.checkInteraction, null, this);
    }

    update() {
        this.player.update();
    }

    checkInteraction(player, object) {
        if (this.input.keyboard.checkDown(this.player.cursors.space, 500)) {
            this.showCutscene([
                "The cold plunge! A moment of adventure and laughter.",
                "You remember the joy it brought."
            ]);
        }
    }

    showCutscene(cutsceneLines) {
        let cutsceneIndex = 0;
        const cutsceneBox = this.add.rectangle(448, 450, 896, 100, 0x000000, 0.7).setOrigin(0.5);
        const cutsceneText = this.add.text(100, 430, cutsceneLines[cutsceneIndex], { fontSize: "16px", color: "#fff" });

        cutsceneBox.setInteractive().on("pointerdown", () => {
            cutsceneIndex++;
            if (cutsceneIndex < cutsceneLines.length) {
                cutsceneText.setText(cutsceneLines[cutsceneIndex]);
            } else {
                cutsceneBox.destroy();
                cutsceneText.destroy();
                this.scene.start("HouseOfTraditions");
            }
        });
    }
}

export default ParkOfFirsts;
