class Start extends Phaser.Scene {
    constructor() {
        super("start");
    }

    preload() {
        this.load.spritesheet('boss_idle', './assets/drake_idle_sheet.png', {frameWidth: 96, frameHeight: 128, startFrame: 0, endFrame: 3});
        this.load.spritesheet('boss_walk', './assets/drake_walk_sheet.png', {frameWidth: 96, frameHeight: 128, startFrame: 0, endFrame: 3});
        this.load.spritesheet('player_idle', './assets/knight_player_idle_sheet.png', {frameWidth: 48, frameHeight: 48, startFrame: 0, endFrame: 3});
        this.load.spritesheet('player_running', './assets/knight_player_running_sheet.png', {frameWidth: 48, frameHeight: 48, startFrame: 0, endFrame: 3});
        this.load.spritesheet('arrow', './assets/fireball_cyan_sheet.png', {frameWidth: 32, frameHeight: 32, startFrame: 0, endFrame: 3});
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
        this.add.text(10, game.config.height/1.5 + 50, 'This is supposed to be a Start scene\nW to start', menuConfig).setOrigin(0);
        // define keys
        this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);

    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.keyW)) {

          this.scene.start("scene_1");    
        }
      }
}