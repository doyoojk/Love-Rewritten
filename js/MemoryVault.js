import Player from './Player.js';

class MemoryVault extends Phaser.Scene {
    constructor() {
        super({ key: "MemoryVault" });
    }

    preload() {
        console.log("Preloading assets for MemoryVault...");
        this.load.image("vault_background", "data/vault.PNG");
        this.load.image("vault_object", "data/vault_object.PNG");
        this.load.image("final_cutscene", "data/collage.png");
        // this.load.image("player", "data/colby.png");
        this.load.audio("vault_audio", "data/vault.mp3");
        this.load.spritesheet('player_spritesheet', 'data/spritesheet.png', {
            frameWidth: 145.2,  // Width of each frame in the sprite sheet
            frameHeight: 245  // Height of each frame
        });
    }

    create() {
        console.log("Scene MemoryVault is running.");
        this.cameras.main.fadeIn(1000, 0, 0, 0);   
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
            "This must be the final memory...",,
            "Jamie: You've come so far, but there's one last thing you need to do.",,
            "It's time to open the vault and discover the truth..."
        ]);
    }

    startDialogue(dialogueLines) {
        let dialogueIndex = 0;
        const dialogueBox = this.add.rectangle(896, 970, 1792, 300, 0x000000, 0.7).setOrigin(0.5);
        const dialogueText = this.add.text(100, 890, dialogueLines[dialogueIndex], { fontSize: "30px", color: "#fff" });

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
                    ,"The vault has opened...",
                    "You find a letter waiting for you",,
                    "Dear Colby,",
                    "Happy Valentines day!",
                    "I hope you enjoyed this experience as much as I had fun making it.",
                    "Did I go a little overboard on the valentines day gift?",
                    "Maybe (I am going to regret this on your bday cause idk if I can top this)",
                    "I thought it would be fun to go through our memories together but in a fun way :)",
                    "Though it is highly unrealistic that you would ever forget me!!!!\nI hope you had fun navigating through our memories again with me through this game",
                    "This is my second valentines day with you,\nand I am as excited as I was to be your valentine as I was during the first",
                    "Long distance is hard, and we both get busy with life",
                    "And so i wanted to take a step back and just appreciate how lucky we are\nto have so many good memories to constantly remind us of what we’re working towards",
                    "I love you so much,\nand I can't wait to continue to make beautiful memories with you <3",
                    "Love, Jamie"
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
        const cutsceneBox = this.add.rectangle(896, 970, 1792, 300, 0x000000, 0.4).setOrigin(0.5);
        const cutsceneText = this.add.text(100, 890, cutsceneLines[cutsceneIndex], { fontSize: "30px", color: "#fff" });

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
