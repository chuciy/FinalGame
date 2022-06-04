class Defeat extends Phaser.Scene {
    constructor() {
        super("defeat");
    }

    preload() {
      
    }

    create() {
        // menu text configuration
        let menuConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#ABCDEF',
            color: '#EFABCD',
            align: 'left',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }
        // show menu text
        this.add.text(10, game.config.height/1.5 + 50, 'This is supposed to be a Defeat scene\nW to back to start', menuConfig).setOrigin(0);
        // define keys
        this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);

        this.bg = this.add.image(0, 0, 'df').setOrigin(0, 0);

    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.keyW)) {

          this.scene.start("start");    
        }
      }
}