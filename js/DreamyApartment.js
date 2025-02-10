import Player from './Player.js';  // Import the player class

class DreamyApartment extends Phaser.Scene {
    constructor() {
        super({ key: "DreamyApartment" });
    }

    preload() {
        console.log("Preloading assets for DreamyApartment...");
        this.load.image("apt_background", "data/apartment.png");
        this.load.image("apt_cutscene", "data/cold_plunge_memory.png");
        this.load.image("apt_object", "data/photo_frame.png");
        this.load.image("player", "data/colby.png");
    }

    create() {
        console.log(`Scene DreamyApartment is running.`);

        // Initialize the apt_background and interactive apt_object
        this.apt_background = this.add.image(896, 511, "apt_background").setDisplaySize(1792, 1022);
        this.player = new Player(this, 896, 511);  // Center the player
        this.trigger = this.physics.add.sprite(400, 300, "apt_object").setInteractive().setVisible(true);

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
            console.log("apt_object clicked. Starting apt_cutscene...");
            this.showapt_cutscene([ ,
                "You see an old photo frame.",
                "Memories of your first moments here flood back."
            ]);
        });
    }

    showapt_cutscene(apt_cutsceneLines) {
        let apt_cutsceneIndex = 0;
    
        // Hide the player and apt_object
        this.player.player.setVisible(false);
        this.trigger.setVisible(false);
    
        // Show apt_cutscene apt_background and first dialogue line
        const apt_cutsceneImage = this.add.image(896, 511, "apt_cutscene").setDisplaySize(1792, 1022);
        const apt_cutsceneBox = this.add.rectangle(896, 970, 1792, 100, 0x000000, 0.7).setOrigin(0.5);
        const apt_cutsceneText = this.add.text(100, 940, apt_cutsceneLines[apt_cutsceneIndex], { fontSize: "24px", color: "#fff" });
    
        // Remove all previous listeners to avoid overlap
        this.input.removeAllListeners();
    
        this.input.once('pointerdown', () => {
            this.advanceCutscene(apt_cutsceneLines, apt_cutsceneIndex + 1, apt_cutsceneBox, apt_cutsceneText, apt_cutsceneImage);
        });
    }
    
    advanceCutscene(apt_cutsceneLines, apt_cutsceneIndex, apt_cutsceneBox, apt_cutsceneText, apt_cutsceneImage) {
        if (apt_cutsceneIndex < apt_cutsceneLines.length) {
            apt_cutsceneText.setText(apt_cutsceneLines[apt_cutsceneIndex]);
            
            this.input.once('pointerdown', () => {
                this.advanceCutscene(apt_cutsceneLines, apt_cutsceneIndex + 1, apt_cutsceneBox, apt_cutsceneText, apt_cutsceneImage);
            });
        } else {
            console.log("apt_cutscene finished. Transitioning to ParkOfFirsts...");
    
            this.playerEnabled = false;    
            this.cameras.main.fadeOut(2000, 0, 0, 0);
            this.scene.start("ParkOfFirsts");
        }
    }
    
    update() {
        if (this.playerEnabled) {
            this.player.update();
        }
    }
}

export default DreamyApartment;
