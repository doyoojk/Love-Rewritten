class MemoryVault extends Phaser.Scene {
    constructor() {
        super({ key: "MemoryVault" });
    }

    preload() {
        this.load.image("background", "assets/images/vault.png");
        this.load.image("door", "assets/images/door.png");
    }

    create() {
        this.add.image(400, 300, "background");
        this.door = this.physics.add.sprite(700, 300, "door").setInteractive();
        
        this.door.on("pointerdown", () => {
            if (this.memoryUnlocked) {
                this.scene.start("DreamyApartment");
            }
        });

        this.memoryUnlocked = false;  // Memory must be triggered first

        this.createTrigger();
    }

    createTrigger() {
        this.trigger = this.physics.add.sprite(400, 300, "door").setInteractive();

        this.trigger.on("pointerdown", () => {
            this.showMemoryCutscene();
        });
    }

    showMemoryCutscene() {
        let overlay = this.add.rectangle(400, 300, 800, 600, 0x000000, 0.8).setDepth(1);
        let text = this.add.text(200, 250, "Memory Unlocked!", { fontSize: "24px", fill: "#fff" }).setDepth(2);

        this.time.delayedCall(2000, () => {
            overlay.destroy();
            text.destroy();
            this.memoryUnlocked = true;
        });
    }
}
