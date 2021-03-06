class Victory extends Phaser.Scene {
    constructor() {
        super("victory");
    }

    preload() {
      
    }

    create() {

        // menu text configuration
        let menuConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#101010',
            color: '#FFFFFF',
            align: 'left',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }
        // show menu text
        this.add.text(10, game.config.height/1.5 + 50, 'This is supposed to be a Victory scene\nW to back to start', menuConfig).setOrigin(0);
        // define keys
        this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);

        this.bg = this.add.image(0, 0, 'vc').setOrigin(0, 0);

    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.keyW)) {

          this.scene.start("start");    
        }
      }
}