class MainMenu extends Phaser.Scene {
    constructor() {
        super({ key: "MainMenu" });
    }

    preload() {
        this.load.image("mainmenu_background", ".data/mainmenu.png");
        document.fonts.load('16px "Pixelify Sans"').then(() => {
            console.log("Pixelify Sans font loaded!");
        });
    }

    create() {
        // Add background
        this.mainmenu_background = this.add.image(896, 511, "mainmenu_background").setDisplaySize(1792, 1022);

        // Title and subtitle
        const titleText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - 40, "Love, Rewritten", { fontSize: "130px", fontFamily: "Pixelify Sans", color: "#a1007e"}).setOrigin(0.5);
        const subtitleText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY + 60, "a game made with love by Jamie <3", { fontSize: "30px", fontFamily: "Pixelify Sans", color: "#a1007e" }).setOrigin(0.5);

        // Create a rounded rectangle using Graphics
        const startButtonGraphics = this.add.graphics();
        startButtonGraphics.fillStyle(0xffffff, 1);
        startButtonGraphics.fillRoundedRect(this.cameras.main.centerX - 185, 650, 370, 100, 40); 

        // Add "Start Game" text
        const startText = this.add.text(this.cameras.main.centerX, 700, "Start Game", { fontSize: "43px", fontFamily: "Pixelify Sans", color: "#cf00a9" }).setOrigin(0.5);

        // Add interactive area
        const interactiveZone = this.add.zone(this.cameras.main.centerX, 700, 370, 100).setOrigin(0.5).setInteractive();

        interactiveZone.on("pointerdown", () => {
            console.log("Starting DreamyApartment scene");
            this.scene.start("DreamyApartment");
        });
    }
}

export default MainMenu;
