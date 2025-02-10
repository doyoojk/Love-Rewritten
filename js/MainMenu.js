class MainMenu extends Phaser.Scene {
    constructor() {
        super({ key: "MainMenu" });
    }

    preload() {
        // No image loading
    }

    create() {
        // Clear the screen and set background to pink
        this.cameras.main.setBackgroundColor(0xffc0cb);  // Pink background

        // Create a start button
        const startButton = this.add.rectangle(this.cameras.main.centerX, this.cameras.main.centerY, 300, 80, 0xffffff).setOrigin(0.5);  // White button
        const startText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, "Start Game", { fontSize: "32px", color: "#000" }).setOrigin(0.5);  // Centered text

        startButton.setInteractive().on("pointerdown", () => {
            console.log("Starting DreamyApartment scene");
            this.scene.start("DreamyApartment");
        });
    }
}

export default MainMenu;
