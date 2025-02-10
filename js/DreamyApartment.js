import Player from './Player.js';  // Import the player class

class DreamyApartment extends Phaser.Scene {
    constructor() {
        super({ key: "DreamyApartment" });
    }

    preload() {
        console.log("Preloading assets for DreamyApartment...");
        this.load.image("background", "data/apartment.png");
        this.load.image("cutscene", "data/cold_plunge_memory.png");
        this.load.image("object", "data/photo_frame.png");
        this.load.image("player", "data/colby.jpg");
    }

    create() {
        console.log(`Scene DreamyApartment is running.`);

        // Initialize the background and interactive object
        this.background = this.add.image(896, 511, "background").setDisplaySize(1792, 1022);
        this.player = new Player(this, 896, 511);  // Center the player
        console.log("Background and player created.");

        this.trigger = this.physics.add.sprite(400, 300, "object").setInteractive().setVisible(true);
        console.log("Interactive object added at 400, 300");

        // Start the initial dialogue
        this.startDialogue([
            "This is your apartment. It feels oddly familiar.",
            "You should look around and find something meaningful."
        ]);

        this.playerEnabled = false;  // Player movement is initially disabled
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

        this.trigger.on("pointerdown", () => {
            console.log("Object clicked. Starting cutscene...");
            this.showCutscene([ ,
                "You see an old photo frame.",
                "Memories of your first moments here flood back."
            ]);
        });
    }

    showCutscene(cutsceneLines) {
        let cutsceneIndex = 0;
    
        // Hide the player and object
        this.player.player.setVisible(false);
        this.trigger.setVisible(false);
        console.log("Player and object hidden.");
    
        // Show cutscene background and first dialogue line
        const cutsceneImage = this.add.image(896, 511, "cutscene").setDisplaySize(1792, 1022);
        const cutsceneBox = this.add.rectangle(896, 970, 1792, 100, 0x000000, 0.7).setOrigin(0.5);
        const cutsceneText = this.add.text(100, 940, cutsceneLines[cutsceneIndex], { fontSize: "24px", color: "#fff" });
    
        // Remove all previous listeners to avoid overlap
        this.input.removeAllListeners();
    
        this.input.once('pointerdown', () => {
            this.advanceCutscene(cutsceneLines, cutsceneIndex + 1, cutsceneBox, cutsceneText, cutsceneImage);
        });
    }
    
    advanceCutscene(cutsceneLines, cutsceneIndex, cutsceneBox, cutsceneText, cutsceneImage) {
        if (cutsceneIndex < cutsceneLines.length) {
            cutsceneText.setText(cutsceneLines[cutsceneIndex]);
            
            this.input.once('pointerdown', () => {
                this.advanceCutscene(cutsceneLines, cutsceneIndex + 1, cutsceneBox, cutsceneText, cutsceneImage);
            });
        } else {
            console.log("Cutscene finished. Transitioning to ParkOfFirsts...");
    
            // Clean up all elements
            cutsceneBox.destroy();
            cutsceneText.destroy();
            cutsceneImage.destroy();
    
            // Manually destroy all scene elements
            if (this.background) this.background.destroy();  // Remove background
            if (this.trigger) this.trigger.destroy();        // Remove object
            this.player.player.destroy();                    // Remove player sprite
            console.log("Background, player, and object destroyed.");
    
            this.playerEnabled = false;
            this.sceneTransitioning = true;
    
            this.cameras.main.fadeOut(1000, 0, 0, 0);
    
            this.time.delayedCall(1000, () => {
                console.log("Fully stopping DreamyApartment and starting ParkOfFirsts.");
                this.scene.stop("DreamyApartment");
                this.scene.start("ParkOfFirsts");
            });
        }
    }
    
    update() {
        if (this.playerEnabled && !this.sceneTransitioning) {
            this.player.update();
        }
    }
}

export default DreamyApartment;
