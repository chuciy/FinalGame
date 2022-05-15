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

        //collision info
        this.x_p2b = 500;       // x distance from player to boss: boss.x - player.x

        //enemy
        this.boss = new Boss(this, 700, 700, 'boss', 0);
        this.bossFSM = new StateMachine("idle_boss", {
            idle_boss: new IdleState_Boss(),
            onhit_boss : new OnHitState_Boss(),




        }, [this, this.boss]);

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
        this.x_p2b = this.boss.body.x - this.player.body.x;

        this.physics.world.collide(this.player, this.boss, this.onCollision, null, this);

        this.playerFSM.step();
        this.bossFSM.step();
    }

    onCollision(){

        this.playerFSM.collision = true;
        this.bossFSM.collision = true;

    }


}
