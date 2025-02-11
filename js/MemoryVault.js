import Player from './Player.js';

class MemoryVault extends Phaser.Scene {
    constructor() {
        super({ key: "MemoryVault" });
    }

    preload() {
        console.log("Preloading assets for MemoryVault...");
        this.load.image("vault_background", "data/vault.png");
        this.load.image("vault_object", "data/vault_object.png");
        this.load.image("final_cutscene", "data/love_letter_reveal.png");
        this.load.image("player", "data/colby.png");
        this.load.audio("vault_audio", "data/vault.mp3");
        this.load.spritesheet('player_spritesheet', 'data/spritesheet.png', {
            frameWidth: 145.2,  // Width of each frame in the sprite sheet
            frameHeight: 245  // Height of each frame
        });
    }

    create() {
        console.log("Scene MemoryVault is running.");
        // Initialize and play vault audio
        this.vault_audio = this.sound.add("vault_audio");
        this.vault_audio.play({ loop: true });

        // Initialize background and player
        this.vault_background = this.add.image(896, 511, "vault_background").setDisplaySize(1792, 1022);
        this.player = new Player(this, 896, 511, "player_spritesheet");  // Center the player
        this.vault_object = this.physics.add.sprite(906, 141, "vault_object").setInteractive();

        this.playerEnabled = false;  // Player movement is initially disabled
        this.interactionTriggered = false;  // Ensure the cutscene plays only once

        // Start initial dialogue
        this.startDialogue([
            "You've reached the final memory.",
            "It's time to see everything clearly."
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
                this.startExploration();
            }
        });
    }

    startExploration() {
        this.playerEnabled = true;
        this.vault_object.on('pointerdown', () => {
            if (!this.interactionTriggered) {
                this.interactionTriggered = true;
                this.showFinalCutscene([
                    ,"The final love letter is revealed...",
                    "Everything comes rushing back to you."
                ]);
            }
        });
    }

    update() {
        if (this.playerEnabled) {
            this.player.update();
        }
    }

    showFinalCutscene(cutsceneLines) {
        let cutsceneIndex = 0;

        // Hide the player and vault object
        this.player.player.setVisible(false);
        this.vault_object.setVisible(false);

        // Show final cutscene image and first line of dialogue
        const finalCutsceneImage = this.add.image(896, 511, "final_cutscene").setDisplaySize(1792, 1022);
        const cutsceneBox = this.add.rectangle(896, 970, 1792, 100, 0x000000, 0.7).setOrigin(0.5);
        const cutsceneText = this.add.text(100, 940, cutsceneLines[cutsceneIndex], { fontSize: "24px", color: "#fff" });

        this.input.once('pointerdown', () => {
            this.advanceCutscene(cutsceneLines, cutsceneIndex + 1, cutsceneBox, cutsceneText, finalCutsceneImage);
        });
    }

    advanceCutscene(cutsceneLines, cutsceneIndex, cutsceneBox, cutsceneText, finalCutsceneImage) {
        if (cutsceneIndex < cutsceneLines.length) {
            cutsceneText.setText(cutsceneLines[cutsceneIndex]);

            this.input.once('pointerdown', () => {
                this.advanceCutscene(cutsceneLines, cutsceneIndex + 1, cutsceneBox, cutsceneText, finalCutsceneImage);
            });
        } else {
            console.log("Final cutscene finished. Returning to MainMenu...");
            this.playerEnabled = false;
            this.vault_audio.stop();
            this.cameras.main.fadeOut(2000, 0, 0, 0);
    
            this.time.delayedCall(2000, () => {
                this.scene.start("MainMenu");
            });
        }
    }
}

export default MemoryVault;
