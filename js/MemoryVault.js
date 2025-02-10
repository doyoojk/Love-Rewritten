import Player from './Player.js';

class MemoryVault extends Phaser.Scene {
    constructor() {
        super({ key: "MemoryVault" });
    }

    preload() {
        console.log("Preloading assets for MemoryVault...");
        this.load.image("vault_background", "data/vault.png");
        this.load.image("vault_object","data/vault_object.png");
        this.load.image("final_cutscene", "data/love_letter_reveal.png");
        this.load.image("player", "data/colby.png");
    }

    create() {
        console.log(`Scene MemoryVault is running.`);

        // Initialize background and player
        this.vault_background = this.add.image(896, 511, "vault_background").setDisplaySize(1792, 1022);
        this.player = new Player(this, 896, 511);
        console.log("Vault background and player created.");

        this.playerEnabled = false;  // Player movement is initially disabled

        // Start the initial dialogue
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
                this.showFinalCutscene();  // Trigger the final cutscene
            }
        });
    }

    showFinalCutscene() {
        console.log("Showing final cutscene...");
        
        // Hide the player
        this.player.player.setVisible(false);

        // Show final cutscene image and dialogue
        const cutsceneImage = this.add.image(896, 511, "final_cutscene").setDisplaySize(1792, 1022);
        const cutsceneBox = this.add.rectangle(896, 970, 1792, 100, 0x000000, 0.7).setOrigin(0.5);
        const cutsceneText = this.add.text(100, 940, "The final love letter is revealed...", { fontSize: "24px", color: "#fff" });

        this.input.removeAllListeners();  // Remove any previous listeners to avoid conflicts

        this.input.once('pointerdown', () => {
            console.log("Final cutscene finished. Returning to MainMenu...");
            cutsceneBox.destroy();
            cutsceneText.destroy();
            cutsceneImage.destroy();
            this.transitionToMainMenu();
        });
    }

    transitionToMainMenu() {
        this.cameras.main.fadeOut(2000, 0, 0, 0);

        this.time.delayedCall(2000, () => {
            console.log("Transition complete. Returning to MainMenu.");
            this.scene.start("MainMenu");
        });
    }

    update() {
        if (this.playerEnabled) {
            this.player.update();
        }
    }
}

export default MemoryVault;