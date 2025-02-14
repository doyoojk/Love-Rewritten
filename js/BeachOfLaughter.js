import Player from './Player.js';

class BeachOfLaughter extends Phaser.Scene {
    constructor() {
        super({ key: "BeachOfLaughter" });
    }

    preload() {
        console.log("Preloading assets for BeachOfLaughter...");
        this.load.image("beach_background", "data/beach.png");
        this.load.image("beach_cutscene", "data/beach_cutscene.png");
        this.load.image("radio_object", "data/radio.png");
        this.load.image("player", "data/colby.png");
        this.load.audio("goldfish", "data/goldfish.mp3");  // Preload the audio
        this.load.audio("beach_audio", "data/beach.mp3");
        this.load.spritesheet('player_spritesheet', 'data/spritesheet.png', {
            frameWidth: 145.2,  // Width of each frame in the sprite sheet
            frameHeight: 245  // Height of each frame
        });
    }

    create() {
        console.log(`Scene BeachOfLaughter is running.`);
        this.cameras.main.fadeIn(1000, 0, 0, 0);  

        // Initialize background and player
        this.beach_background = this.add.image(896, 511, "beach_background").setDisplaySize(1792, 1022);
        this.player = new Player(this, 966, 691, "player_spritesheet");  // Center the player

        this.radio_object = this.physics.add.sprite(1626, 141, "radio_object").setInteractive().setVisible(true);
        this.goldfishMusic = this.sound.add("goldfish");  // Create the audio instance

        this.beach_audio = this.sound.add("beach_audio");
        this.beach_audio.play({ loop: true });

        this.playerEnabled = false;  // Player movement is initially disabled

        // Start the initial dialogue
        this.startDialogue([
            "You smell the salty air and the warmth of the sunset dawning on you...",
            "The sounds of waves bring you a sense of peace",
            "You look around hoping to see Jamie, but you're alone...",,
            "You: Jamie? Where are you?",
            "Jamie: I'm right here! I'm enjoying the view as well.",
            "Jamie: You're still the same hahaha",
            "You: In what way?",
            "Jamie: I loved how you would share with me when you saw something beautiful.",,
            "You remember spending time here watching the sunset",
            "The memory still somehow seems incomplete...",
            "Perhaps there's something here that will help me remember..."
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
                this.startExploration();  // Enable player movement and exploration
            }
        });
    }

    startExploration() {
        this.playerEnabled = true;  // Allow player movement

        this.radio_object.on("pointerdown", () => {
            this.beach_audio.stop();
            this.showBeachCutscene([
                , "A familiar tune plays, and the memories of the beach oose back into your mind...",
                "The laughter, the joy, the peace...",
                "You remember that you weren't alone...",
                "It couldn't have been alone!",,
                "You: Jamie, I remember now.",
                "You: It was you! You were here with me all along.",
                "Jamie: Yes, I was always here with you.",
                "Jamie: Everything would magically work out when we were together.",
                "Jamie: I missed you so much.",,
                "You: I missed you too Jamie."
            ]);
        });
    }

    showBeachCutscene(beach_cutsceneLines) {
        let cutsceneIndex = 0;

        // Hide the player and object
        this.player.player.setVisible(false);
        this.radio_object.setVisible(false);

        // Show cutscene background and first dialogue line
        const beach_cutsceneImage = this.add.image(896, 511, "beach_cutscene").setDisplaySize(1792, 1022);
        const beach_cutsceneBox = this.add.rectangle(896, 970, 1792, 300, 0x000000, 0.7).setOrigin(0.5);
        const beach_cutsceneText = this.add.text(100, 890, beach_cutsceneLines[cutsceneIndex], { fontSize: "30px", color: "#fff" });

        this.goldfishMusic.play();  // Start playing the audio

        this.input.once('pointerdown', () => {
            this.advanceCutscene(beach_cutsceneLines, cutsceneIndex + 1, beach_cutsceneBox, beach_cutsceneText, beach_cutsceneImage);
        });
    }

    advanceCutscene(beach_cutsceneLines, cutsceneIndex, beach_cutsceneBox, beach_cutsceneText, beach_cutsceneImage) {
        if (cutsceneIndex < beach_cutsceneLines.length) {
            beach_cutsceneText.setText(beach_cutsceneLines[cutsceneIndex]);

            this.input.once('pointerdown', () => {
                this.advanceCutscene(beach_cutsceneLines, cutsceneIndex + 1, beach_cutsceneBox, beach_cutsceneText, beach_cutsceneImage);
            });
        } else {
            console.log("Beach cutscene finished. Transitioning to MemoryVault...");
            this.goldfishMusicFadeOut();  // Stop the audio
            this.playerEnabled = false;
            this.cameras.main.fadeOut(2000, 0, 0, 0);
            this.time.delayedCall(1000, () => {
                this.scene.start("MemoryVault");
            });
        }
    }

    goldfishMusicFadeOut() {
        if (this.goldfishMusic.isPlaying) {
            this.tweens.add({
                targets: this.goldfishMusic,
                volume: 0,
                duration: 500,  // Fade out over 2 seconds
                onComplete: () => {
                    this.goldfishMusic.stop();
                    console.log("Goldfish music faded out and stopped.");
                }
            });
        }
    }

    update() {
        if (this.playerEnabled) {
            this.player.update();
    
            // Restrict entry into the zone where y < 475 and x < 1580
            if (this.player.player.y < 475 && this.player.player.x < 1580) {
                if (this.player.player.previousY >= 475) {
                    this.player.player.y = 475;
                } else {
                    this.player.player.x = 1580;
                }
            }
    
            // Update the previous position for future checks
            this.player.player.previousX = this.player.player.x;
            this.player.player.previousY = this.player.player.y;
        }
    }    
    
}

export default BeachOfLaughter;
