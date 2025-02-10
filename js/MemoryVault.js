import Player from './Player.js';

class MemoryVault extends Phaser.Scene {
    constructor() {
        super({ key: "MemoryVault" });
    }

    preload() {
        this.load.image("background", "data/vault.png");
        this.load.image("colby", "data/colby.jpg");
        this.load.image("cutscene", "data/love_letter_reveal.png");
    }

    create() {
        this.add.image(896, 511, "background").setDisplaySize(1792, 1022);


        // Create player
        this.player = new Player(this, 100, 100);

        this.startDialogue([
            "You've reached the final memory.",
            "It's time to see everything clearly."
        ]);
    }

    startDialogue(dialogueLines) {
        let dialogueIndex = 0;
        const dialogueBox = this.add.rectangle(896, 970, 1792, 100, 0x000000, 0.7).setOrigin(0.5);
        const dialogueText = this.add.text(100, 940, dialogueLines[dialogueIndex], { fontSize: "24px", color: "#fff" });
    
        // Make the entire game screen clickable
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
    

    showFinalCutscene() {
        const cutsceneImage = this.add.image(448, 256, "cutscene");
        const cutsceneBox = this.add.rectangle(448, 450, 896, 100, 0x000000, 0.7).setOrigin(0.5);
        const cutsceneText = this.add.text(100, 430, "The final love letter is revealed...", { fontSize: "16px", color: "#fff" });

        cutsceneBox.setInteractive().on("pointerdown", () => {
            cutsceneBox.destroy();
            cutsceneText.destroy();
            cutsceneImage.destroy();
            this.scene.start("MainMenu");
        });
    }
}

export default MemoryVault;
