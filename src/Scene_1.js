class Scene_1 extends Phaser.Scene {
    constructor() {
        super("scene_1");
    }

    preload() {
        this.load.image('player', 'assets/player.png');
    }

    create() {
        //UI
        this.cameras.main.setBackgroundColor('#FACADE');

        //player
        this.player = new Player(this, 200, 200, 'player', 0);
        this.playerFSM = new StateMachine("idle", {
            idle: new IdleState(),
            move: new MoveState(),
            jump: new JumpState(),
            kick: new KickState(),
        }, [this, this.player]);

        //keys
        this.keys = this.input.keyboard.createCursorKeys();
        this.keys.AKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);

    }

    update(){
        this.playerFSM.step();
    }


}
