import Player from './Player.js';

class ParkOfFirsts extends Phaser.Scene {
    constructor() {
        super({ key: "ParkOfFirsts" });
    }

    preload() {
        console.log("Preloading assets for ParkOfFirsts...");
        this.load.image("lake_background", "data/lake.png");
        this.load.image("player", "data/colby.jpg");
        this.load.image("lake_object", "data/lake_zone.png");
    }

    create() {
        console.log("Scene ParkOfFirsts is running.");
        this.children.removeAll();
        this.cameras.main.fadeIn(1000, 0, 0, 0);  // Smooth fade-in effect

        const lake_background = this.add.image(896, 511, "lake_background").setDisplaySize(1792, 1022);
        console.log("lake_background added.");
        console.log(this.textures.exists("lake_background") ? "lake_background texture loaded." : "lake_background texture missing!");
        this.children.bringToTop(lake_background);


        this.player = new Player(this, 896, 511);
        console.log("Player created at: 100, 100");

        this.lake_object = this.physics.add.sprite(400, 300, "lake_object").setInteractive();
        console.log("Interactive lake_object added at: 400, 300");

        // Start the scene dialogue
        this.startSceneDialogue([
            "Welcome to the park. It feels peaceful and familiar.",
            "Perhaps there's something here that will help you remember."
        ]);
    }

    startSceneDialogue(dialogueLines) {
        console.log("Starting scene dialogue...");
        let dialogueIndex = 0;
    
        const dialogueBox = this.add.rectangle(896, 970, 1792, 100, 0x000000, 0.7).setOrigin(0.5);
        const dialogueText = this.add.text(100, 940, dialogueLines[dialogueIndex], { fontSize: "24px", color: "#fff" });
    
        const advanceDialogue = () => {
            dialogueIndex++;
            if (dialogueIndex < dialogueLines.length) {
                console.log(`Dialogue line ${dialogueIndex}: ${dialogueLines[dialogueIndex]}`);
                dialogueText.setText(dialogueLines[dialogueIndex]);
            } else {
                console.log("Scene dialogue finished. Enabling player movement.");
                dialogueBox.destroy();
                dialogueText.destroy();
                this.input.off('pointerdown', advanceDialogue);  // Remove the listener after finishing dialogue
                this.enablePlayer();
            }
        };
    
        this.input.on('pointerdown', advanceDialogue);  // Attach the listener once
    }
    

    enablePlayer() {
        console.log("Player movement enabled.");
        this.physics.add.overlap(this.player.player, this.lake_object, this.checkInteraction, null, this);
    }

    update() {
        this.player.update();
    }

    checkInteraction(player, lake_object) {
        console.log("Checking interaction...");
        if (this.input.keyboard.checkDown(this.player.cursors.space, 500)) {
            console.log("Interaction detected. Starting cutscene...");
            this.showCutscene([
                "The cold plunge! A moment of adventure and laughter.",
                "You remember the joy it brought."
            ]);
        }
    }

    showCutscene(cutsceneLines) {
        console.log("Showing cutscene...");
        let cutsceneIndex = 0;

        const cutsceneBox = this.add.rectangle(896, 970, 1792, 100, 0x000000, 0.7).setOrigin(0.5);
        const cutsceneText = this.add.text(100, 940, cutsceneLines[cutsceneIndex], { fontSize: "24px", color: "#fff" });
        console.log(`Cutscene line 0: ${cutsceneLines[cutsceneIndex]}`);

        this.trigger.once('pointerdown', () => {
            this.advanceCutscene(cutsceneLines, cutsceneIndex + 1, cutsceneBox, cutsceneText);
        });
    }

    advanceCutscene(cutsceneLines, cutsceneIndex, cutsceneBox, cutsceneText) {
        if (cutsceneIndex < cutsceneLines.length) {
            console.log(`Cutscene line ${cutsceneIndex}: ${cutsceneLines[cutsceneIndex]}`);

            cutsceneText.setText(cutsceneLines[cutsceneIndex]);
            this.input.once('pointerdown', () => {
                this.advanceCutscene(cutsceneLines, cutsceneIndex + 1, cutsceneBox, cutsceneText);
            });
        } else {
            console.log("Cutscene finished. Transitioning to HouseOfTraditions...");
            
            cutsceneBox.destroy();
            cutsceneText.destroy();

            this.cameras.main.fadeOut(1000, 0, 0, 0);
            this.time.delayedCall(1000, () => {
                console.log("Transition complete. Starting HouseOfTraditions.");
                this.input.removeAllListeners();
                this.scene.start("HouseOfTraditions");
            });
        }
    }
}

export default ParkOfFirsts;
