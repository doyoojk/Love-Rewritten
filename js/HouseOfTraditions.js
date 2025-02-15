import Player from './Player.js';

class HouseOfTraditions extends Phaser.Scene {
    constructor() {
        super({ key: "HouseOfTraditions" });
    }

    preload() {
        console.log("Preloading assets for HouseOfTraditions...");
        this.load.image("hanok_background", "data/hanok.PNG");
        // this.load.image("player", "data/colby.png");
        this.load.image("grandma_object", "data/grandma.PNG");
        this.load.image("hanok_cutscene", "data/hanok_cutscene.PNG");
        this.load.audio("hanok_audio", "data/hanok.mp3");
        this.load.image("table_overlay", "data/table.PNG");
        this.load.image("bush_overlay", "data/bush.PNG");
        this.load.spritesheet('player_spritesheet', 'data/spritesheet.png', {
            frameWidth: 145.2,  // Width of each frame in the sprite sheet
            frameHeight: 245  // Height of each frame
        });
    }

    create() {
        console.log(`Scene HouseOfTraditions is running.`);
        this.cameras.main.fadeIn(1000, 0, 0, 0);   

        this.hanok_audio = this.sound.add("hanok_audio");
        this.hanok_audio.play({ loop: true });
        this.hanok_background = this.add.image(896, 511, "hanok_background").setDisplaySize(1792, 1022);
        this.table_overlay = this.add.image(896, 511, "table_overlay").setDisplaySize(1792, 1022).setDepth(25);
        this.bush_overlay = this.add.image(896, 511, "bush_overlay").setDisplaySize(1792, 1022).setDepth(25);
        this.player = new Player(this, 896, 511, "player_spritesheet");
        this.grandma_object = this.physics.add.sprite(1571, 761, "grandma_object").setInteractive().setVisible(true).setOrigin(0.5);
        this.playerEnabled = false;  // Player movement is initially disabled

        // Start the initial dialogue
        this.startDialogue([
            "A faint smell of grilled meat fills the cold air around you...",
            "You look up into the sky to see the stars shining brightly.",
            "There is a warm glow coming from the house...",,
            "You: Woah, where am I now?",
            "Jamie: You're in Korea now! Doesn't that KBBQ look good?",
            "You: It sure does! I might not remember much, but I know I wouldn't turn down good food.",
            "Jamie: This night was special for me. I hope you will be able to remember it too.",
            "You: It's a beautiful night. I can't wait to see what happens next!"
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
                this.startExploration();  // Enable player movement and exploration
            }
        });
    }

    startExploration() {
        this.playerEnabled = true;  // Allow player movement

        this.grandma_object.on("pointerdown", () => {
            console.log("Grandma NPC clicked. Starting cutscene...");
            this.showHanokCutscene([
                ,"You: So... this house in Korea is your grandparent's place?",
                "Jamie: Yes, it's a hanok. It's a traditional Korean house.",
                "Jamie: This was a special memory for me,\I got to share a special side of me with you this night.",
                "You: I'm sensing that I must've been a pretty important person in your life.",
                "Jamie: okayyy getiing a little ahead of yourself there buddy",
                "Jamie: but yes, you were very important to me.",
                "You: I can't wait to remember more about our time together. It sounds like it was amazing.",
                "Jamie: It was. And it will be again. I promise!",
                "Jamie: I think you're almost ready to remember everything...",
                "Jamie: I hope you like beaches :)",
                "You: ??"
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
        const hanok_cutsceneBox = this.add.rectangle(896, 970, 1792, 300, 0x000000, 0.4).setOrigin(0.5).setDepth(100);
        const hanok_cutsceneText = this.add.text(100, 890, hanok_cutsceneLines[cutsceneIndex], { fontSize: "30px", color: "#fff" }).setDepth(101);

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
