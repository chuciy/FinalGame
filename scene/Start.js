class Start extends Phaser.Scene {
    constructor() {
        super("start");
    }

    preload() {
        this.load.image('bg', './assets/scene_1_background.png');
        this.load.image("df", "./assets/defeat_scene.png");
        this.load.image("vc", "./assets/victory_scene.png");
        this.load.image("st", "./assets/start_scene.png");
        //boss
        this.load.spritesheet('boss_idle', './assets/drake_idle_sheet.png', {frameWidth: 96, frameHeight: 128, startFrame: 0, endFrame: 3});
        this.load.spritesheet('boss_walk', './assets/drake_walk_sheet.png', {frameWidth: 96, frameHeight: 128, startFrame: 0, endFrame: 3});
        this.load.spritesheet('boss_jump', './assets/drake_electric_jump_sheet.png', {frameWidth: 96, frameHeight: 128, startFrame: 0, endFrame: 3});
        this.load.spritesheet('boss_death', './assets/drake_death_sheet.png', {frameWidth: 160, frameHeight: 160, startFrame: 0, endFrame: 9});

        //player
        this.load.spritesheet('player_idle', './assets/knight_player_idle_sheet.png', {frameWidth: 48, frameHeight: 48, startFrame: 0, endFrame: 3});
        this.load.spritesheet('player_running', './assets/knight_player_running_sheet.png', {frameWidth: 48, frameHeight: 48, startFrame: 0, endFrame: 3});
        this.load.spritesheet('player_jump', './assets/knight_player_jump_sheet.png', {frameWidth: 48, frameHeight: 48, startFrame: 0, endFrame: 7});
        this.load.spritesheet('player_falling', './assets/knight_player_falling_sheet.png', {frameWidth: 48, frameHeight: 48, startFrame: 0, endFrame: 7});
        this.load.spritesheet('player_dash', './assets/knight_player_dash_blue_sheet.png', {frameWidth: 72, frameHeight: 48, startFrame: 0, endFrame: 3});
        this.load.spritesheet('player_kick', './assets/knight_player_kick_green_sheet.png', {frameWidth: 64, frameHeight: 48, startFrame: 0, endFrame: 3});
        this.load.spritesheet('player_block', './assets/knight_player_block_red_sheet.png', {frameWidth: 64, frameHeight: 48, startFrame: 0, endFrame: 3});

        this.load.spritesheet('p_dead', './assets/knight_death_sheet.png', {frameWidth: 80, frameHeight: 48, startFrame: 0, endFrame: 7});

        //misc
        this.load.spritesheet('arrow', './assets/fireball_cyan_sheet.png', {frameWidth: 32, frameHeight: 32, startFrame: 0, endFrame: 3});
        this.load.spritesheet('orb', './assets/fireball_yellow_sheet.png', {frameWidth: 32, frameHeight: 32, startFrame: 0, endFrame: 3});
        this.load.spritesheet('block_success', './assets/Sprite-0001.png', {frameWidth: 64, frameHeight: 64, startFrame: 0, endFrame: 4});
        this.load.spritesheet('slash', './assets/screen_slash_sheet.png', {frameWidth: 1200, frameHeight: 675, startFrame: 0, endFrame: 9});

        this.load.audio('s', 'assets/move_scenes.wav');

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

        this.bg = this.add.image(0, 0, 'st').setOrigin(0, 0);

    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.keyW)) {
          this.sound.play("s");
          this.scene.start("scene_1");    
        }
      }
}