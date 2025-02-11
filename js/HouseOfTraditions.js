import Player from './Player.js';

class HouseOfTraditions extends Phaser.Scene {
    constructor() {
        super({ key: "HouseOfTraditions" });
    }

    preload() {
        console.log("Preloading assets for HouseOfTraditions...");
        this.load.image("hanok_background", "data/hanok.png");
        this.load.image("player", "data/colby.png");
        this.load.image("grandma_object", "data/grandma.png");
        this.load.image("hanok_cutscene", "data/grandma_meeting_memory.png");
        this.load.audio("hanok_audio", "data/hanok.mp3");
        this.load.image("table_overlay", "data/table.png");
        this.load.image("bush_overlay", "data/bush.png");
    }

    create() {
        console.log(`Scene HouseOfTraditions is running.`);

        this.hanok_audio = this.sound.add("hanok_audio");
        this.hanok_audio.play({ loop: true });
        this.hanok_background = this.add.image(896, 511, "hanok_background").setDisplaySize(1792, 1022);
        this.table_overlay = this.add.image(896, 511, "table_overlay").setDisplaySize(1792, 1022).setDepth(25);
        this.bush_overlay = this.add.image(896, 511, "bush_overlay").setDisplaySize(1792, 1022).setDepth(25);
        this.player = new Player(this, 896, 511);
        this.grandma_object = this.physics.add.sprite(1571, 761, "grandma_object").setInteractive().setVisible(true).setOrigin(0.5).setScale(0.8);
        this.playerEnabled = false;  // Player movement is initially disabled

        // Start the initial dialogue
        this.startDialogue([
            "This is a traditional Korean house.",
            "You remember visiting here for the first time and meeting someone special."
        ]);
    }

    startDialogue(dialogueLines) {
        let dialogueIndex = 0;
        const dialogueBox = this.add.rectangle(896, 970, 1792, 100, 0x000000, 0.7).setOrigin(0.5).setDepth(100);
        const dialogueText = this.add.text(100, 940, dialogueLines[dialogueIndex], { fontSize: "24px", color: "#fff" }).setDepth(101);

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
        this.table_overlay.setVisible(false);
        this.bush_overlay.setVisible(false);

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
            this.hanok_audio.stop();
            this.cameras.main.fadeOut(2000, 0, 0, 0);
            this.time.delayedCall(1000, () => {
                this.scene.start("BeachOfLaughter");
            });
        }
    }

    update() {
        if (this.playerEnabled) {
            this.player.update();

            // Apply boundary checks to restrict movement
            this.player.player.x = Math.max(this.player.player.x, 650); 
            this.player.player.y = Math.max(this.player.player.y, 463);  

            if (this.player.player.y > 745) {
                this.table_overlay.setVisible(false);
            } else if (this.player.player.x > 1094) {
                this.table_overlay.setVisible(false);
            } else {
                this.table_overlay.setVisible(true);
            }
        
        }
    }
}

export default HouseOfTraditions;
