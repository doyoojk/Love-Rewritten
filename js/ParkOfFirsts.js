import Player from './Player.js';

class ParkOfFirsts extends Phaser.Scene {
    constructor() {
        super({ key: "ParkOfFirsts" });
    }

    preload() {
        console.log("Preloading assets for ParkOfFirsts...");
        this.load.image("lake_background", "data/lake.png");
        this.load.image("player", "data/colby.png");
        this.load.image("lake_zone", "data/lake_zone.png");
        this.load.image("lake_cutscene", "data/lake_cutscene.png");
        this.load.audio("lake_audio", "data/lake.mp3");
        this.load.audio("splash", "data/splash.wav");
        this.load.image("lake_overlay", "data/lake_overlay.png");
        this.load.spritesheet('player_spritesheet', 'data/spritesheet.png', {
            frameWidth: 145.2,  // Width of each frame in the sprite sheet
            frameHeight: 245  // Height of each frame
        });
    }

    create() {
        console.log("Scene ParkOfFirsts is running.");
        this.cameras.main.fadeIn(1000, 0, 0, 0);   

        // Initialize background and interactive object
        this.lake_background = this.add.image(896, 511, "lake_background").setDisplaySize(1792, 1022);
        this.lake_overlay = this.add.image(896, 511, "lake_overlay").setDisplaySize(1792, 1022).setDepth(20);
        this.player = new Player(this, 896, 511, "player_spritesheet");

        // Initialize and play background audio
        this.lake_audio = this.sound.add("lake_audio");
        this.lake_audio.play({ loop: true });

        this.lake_zone = this.physics.add.sprite(426, 121, "lake_zone").setScale(1.2);
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
        const dialogueBox = this.add.rectangle(896, 970, 1792, 300, 0x000000, 0.7).setOrigin(0.5).setDepth(100);
        const dialogueText = this.add.text(100, 890, dialogueLines[dialogueIndex], { fontSize: "30px", color: "#fff" }).setDepth(101);

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
    
        // Check if the player is hovering over the lake
        if (this.checkManualCollision(this.player.player, this.lake_zone)) {
            if (!this.hoverTimer) {  // Start hover timer if not already started
                this.hoverTimer = this.time.delayedCall(2300, () => {
                    if (this.interactionTriggered) return;  // Ensure cutscene only plays once
                    this.sound.play("splash");
                    this.interactionTriggered = true;
                    this.showLakeCutscene([
                        "The cold plunge! A moment of adventure and laughter.",
                        "You remember the joy it brought."
                    ]);
                }, [], this);
            }
        } else {
            if (this.hoverTimer) {
                this.hoverTimer.remove();  // Cancel the timer if the player leaves
                this.hoverTimer = null;
            }
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
        this.lake_zone.setVisible(false);
        this.lake_overlay.setVisible(false);

        const lake_cutsceneImage = this.add.image(896, 511, "lake_cutscene").setDisplaySize(1792, 1022);
        const lake_cutscenebox = this.add.rectangle(896, 970, 1792, 300, 0x000000, 0.7).setOrigin(0.5);
        const lake_cutsceneText = this.add.text(100, 890, lake_cutscenelines[cutsceneIndex], { fontSize: "30px", color: "#fff" });

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
            this.lake_audio.stop();
            this.cameras.main.fadeOut(3000, 0, 0, 0);
            this.time.delayedCall(1000, () => {
                this.scene.start("HouseOfTraditions");
            });
        }
    }
}

export default ParkOfFirsts;
