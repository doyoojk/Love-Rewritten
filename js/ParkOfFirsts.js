import Player from './Player.js';

class ParkOfFirsts extends Phaser.Scene {
    constructor() {
        super({ key: "ParkOfFirsts" });
    }

    preload() {
        console.log("Preloading assets for ParkOfFirsts...");
        this.load.image("lake_background", "data/lake.png");
        this.load.image("player", "data/colby.png");
        this.load.image("lake_object", "data/lake_zone.png");
        this.load.image("lake_cutscene", "data/cold_plunge_memory.png");
    }

    create() {
        console.log("Scene ParkOfFirsts is running.");

        // Initialize background and interactive object
        this.lake_background = this.add.image(896, 511, "lake_background").setDisplaySize(1792, 1022);
        this.player = new Player(this, 896, 511);

        this.lake_object = this.physics.add.sprite(400, 300, "lake_object");
        this.interactionTriggered = false;  // Flag to ensure cutscene plays only once
        this.playerEnabled = false;  // Disable player movement at the start

        // Start initial scene dialogue
        this.startDialogue([
            "Welcome to the park. It feels peaceful and familiar.",
            "Perhaps there's something here that will help you remember."
        ]);
    }

    startDialogue(dialogueLines) {
        let dialogueIndex = 0;
        const dialogueBox = this.add.rectangle(896, 970, 1792, 100, 0x000000, 0.7).setOrigin(0.5);
        const dialogueText = this.add.text(100, 940, dialogueLines[dialogueIndex], { fontSize: "24px", color: "#fff" });

        this.input.on('pointerdown', () => {
            dialogueIndex++;
            if (dialogueIndex < dialogueLines.length) {
                dialogueText.setText(dialogueLines[dialogueIndex]);
            } else {
                dialogueBox.destroy();
                dialogueText.destroy();
                this.playerEnabled = true;  // Enable player movement and exploration
            }
        });
    }

    update() {
        if (this.playerEnabled) {
            this.player.update();
        }

        if (this.checkManualCollision(this.player.player, this.lake_object)) {
            if (this.interactionTriggered) return;  // Exit if already triggered
            this.interactionTriggered = true;  // Ensure cutscene only plays once
            
            this.showLakeCutscene([
                "The cold plunge! A moment of adventure and laughter.",
                "You remember the joy it brought."
            ]);
        }
    }

    checkManualCollision(spriteA, spriteB) {
        const boundsA = spriteA.getBounds();
        const boundsB = spriteB.getBounds();
        return Phaser.Geom.Intersects.RectangleToRectangle(boundsA, boundsB);
    }

    showLakeCutscene(lake_cutscenelines) {
        let cutsceneIndex = 0;

        // Hide the player and apt_object
        this.player.player.setVisible(false);
        this.lake_object.setVisible(false);

        const lake_cutsceneImage = this.add.image(896, 511, "lake_cutscene").setDisplaySize(1792, 1022);
        const lake_cutscenebox = this.add.rectangle(896, 970, 1792, 100, 0x000000, 0.7).setOrigin(0.5);
        const lake_cutsceneText = this.add.text(100, 940, lake_cutscenelines[cutsceneIndex], { fontSize: "24px", color: "#fff" });

        this.input.once('pointerdown', () => {
            this.advanceCutscene(lake_cutscenelines, cutsceneIndex + 1, lake_cutscenebox, lake_cutsceneText, lake_cutsceneImage);
        });
    }

    advanceCutscene(lake_cutscenelines, cutsceneIndex, lake_cutscenebox, lake_cutsceneText, lake_cutsceneImage) {
        if (cutsceneIndex < lake_cutscenelines.length) {
            lake_cutsceneText.setText(lake_cutscenelines[cutsceneIndex]);

            this.input.once('pointerdown', () => {
                this.advanceCutscene(lake_cutscenelines, cutsceneIndex + 1, lake_cutscenebox, lake_cutsceneText, lake_cutsceneImage);
            });
        } else {
            this.playerEnabled = false;
            this.cameras.main.fadeOut(1000, 0, 0, 0);
            this.scene.start("HouseOfTraditions");
        }
    }
}

export default ParkOfFirsts;
