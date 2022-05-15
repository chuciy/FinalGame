class Scene_1 extends Phaser.Scene {
    constructor() {
        super("scene_1");
    }

    preload() {
        this.load.image('player', 'assets/player.png');
        this.load.image('boss', 'assets/boss.png');
    }

    create() {
        //UI
        this.cameras.main.setBackgroundColor('#FACADE');


        //enemy
        this.boss = new Boss(this, 700, 700, 'boss', 0);

        //player
        this.player = new Player(this, 200, 700, 'player', 0);
        this.playerFSM = new StateMachine("idle", {
            idle: new IdleState(),
            move: new MoveState(),
            jump: new JumpState(),
            kick: new KickState(),
            onhit: new OnHitState(),


        }, [this, this.player]);




        //keys
        this.keys = this.input.keyboard.createCursorKeys();
        this.keys.AKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);

    }

    update(){
        this.physics.world.collide(this.player, this.boss, this.onCollision, null, this);

        this.playerFSM.step();
    }

    onCollision(){
        console.log("h");
        this.playerFSM.collision = true;
    }


}
