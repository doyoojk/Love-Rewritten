class DreamyApartment extends Phaser.Scene {
    constructor() {
        super({ key: "DreamyApartment" });
    }

    preload() {
        this.load.image("background", "data/apartment.png");
        this.load.image("cutscene", "data/cold_plunge_memory.png");
        this.load.image("object", "data/photo_frame.png");
    }

    create() {
        this.add.image(896, 511, "background").setDisplaySize(1792, 1022);
        this.startDialogue([
            "This is your apartment. It feels oddly familiar.",
            "You should look around and find something meaningful."
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
    

    startExploration() {
        this.trigger = this.physics.add.sprite(400, 300, "object").setInteractive();

        this.trigger.on("pointerdown", () => {
            this.showCutscene([
                "You see an old photo frame.",
                "Memories of your first moments here flood back."
            ]);
        });
    }

    showCutscene(cutsceneLines) {
        let cutsceneIndex = 0;
        const cutsceneImage = this.add.image(896, 511, "cutscene").setDisplaySize(1792, 1022);
        const cutsceneBox = this.add.rectangle(896, 970, 1792, 100, 0x000000, 0.7).setOrigin(0.5);
        const cutsceneText = this.add.text(100, 940, cutsceneLines[cutsceneIndex], { fontSize: "16px", color: "#fff" });

        cutsceneBox.setInteractive().on("pointerdown", () => {
            cutsceneIndex++;
            if (cutsceneIndex < cutsceneLines.length) {
                cutsceneText.setText(cutsceneLines[cutsceneIndex]);
            } else {
                cutsceneBox.destroy();
                cutsceneText.destroy();
                cutsceneImage.destroy();
                this.scene.start("ParkOfFirsts");
            }
        });
    }
}

export default DreamyApartment;
