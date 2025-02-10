import Player from './Player.js';

class HouseOfTraditions extends Phaser.Scene {
    constructor() {
        super({ key: "HouseOfTraditions" });
    }

    preload() {
        console.log("Preloading assets for HouseOfTraditions...");
        this.load.image("hanok_background", "data/hanok.png");
        this.load.image("player", "data/colby.jpg");
        this.load.image("grandma_object", "data/grandma.png");
        this.load.image("hanok_cutscene", "data/grandma_meeting_memory.png");
    }

    create() {
        console.log(`Scene HouseOfTraditions is running.`);

        // Initialize background and player
        this.hanok_background = this.add.image(896, 511, "hanok_background").setDisplaySize(1792, 1022);
        this.player = new Player(this, 896, 511);  // Center the player
        console.log("Hanok background and player created.");

        this.grandma_object = this.physics.add.sprite(1571, 761, "grandma_object").setInteractive().setVisible(true).setOrigin(0.5);
        console.log("Grandma NPC added at: 1571, 761");

        this.playerEnabled = false;  // Player movement is initially disabled

        // Start the initial dialogue
        this.startDialogue([
            "This is a traditional Korean house.",
            "You remember visiting here for the first time and meeting someone special."
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
                this.startExploration();  // Enable player movement and exploration
            }
        });
    }

    startExploration() {
        this.playerEnabled = true;  // Allow player movement

        this.grandma_object.on("pointerdown", () => {
            console.log("Grandma NPC clicked. Starting cutscene...");
            this.showHanokCutscene([
                ,"You remember meeting her for the first time.",
                "It was a special moment over delicious food."
            ]);
        });
    }

    showHanokCutscene(hanok_cutsceneLines) {
        let cutsceneIndex = 0;

        // Hide the player and object
        this.player.player.setVisible(false);
        this.grandma_object.setVisible(false);

        // Show cutscene background and first dialogue line
        const hanok_cutsceneImage = this.add.image(896, 511, "hanok_cutscene").setDisplaySize(1792, 1022);
        const hanok_cutsceneBox = this.add.rectangle(896, 970, 1792, 100, 0x000000, 0.7).setOrigin(0.5);
        const hanok_cutsceneText = this.add.text(100, 940, hanok_cutsceneLines[cutsceneIndex], { fontSize: "24px", color: "#fff" });

        // Remove all previous listeners to avoid overlap
        this.input.removeAllListeners();

        this.input.once('pointerdown', () => {
            this.advanceCutscene(hanok_cutsceneLines, cutsceneIndex + 1, hanok_cutsceneBox, hanok_cutsceneText, hanok_cutsceneImage);
        });
    }

    advanceCutscene(hanok_cutsceneLines, cutsceneIndex, hanok_cutsceneBox, hanok_cutsceneText, hanok_cutsceneImage) {
        if (cutsceneIndex < hanok_cutsceneLines.length) {
            hanok_cutsceneText.setText(hanok_cutsceneLines[cutsceneIndex]);

            this.input.once('pointerdown', () => {
                this.advanceCutscene(hanok_cutsceneLines, cutsceneIndex + 1, hanok_cutsceneBox, hanok_cutsceneText, hanok_cutsceneImage);
            });
        } else {
            console.log("Hanok cutscene finished. Transitioning to BeachOfLaughter...");
            this.playerEnabled = false;
            this.cameras.main.fadeOut(2000, 0, 0, 0);
            this.time.delayedCall(1000, () => {
                this.scene.start("BeachOfLaughter");
            });
        }
    }

    update() {
        if (this.playerEnabled) {
            this.player.update();
        }
    }
}

export default HouseOfTraditions;
