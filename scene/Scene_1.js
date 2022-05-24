class Scene_1 extends Phaser.Scene {
    constructor() {
        super("scene_1");
    }

    preload() {
        this.load.image('player', 'assets/player.png');
        this.load.image('boss', 'assets/boss.png');

        this.load.image('arrow', 'assets/arrow.png');


        this.load.audio('se0', 'assets/se0.wav');
    }

    create() {
        //UI
        this.cameras.main.setBackgroundColor('#DDDDDD');

        //collision info
        this.x_p2b = 500;       // x distance from player to boss: boss.x - player.x
        this.px, this.py, this.bx, this.by;

        //enemy
        this.boss = new Boss(this, 700, 700, 'boss', 0);
        this.bossFSM = new StateMachine("idle_boss", {
            idle_boss: new IdleState_Boss(),
            onhit_boss : new OnHitState_Boss(),
            AI_P1 : new AI_P1(),
            AI_P2 : new AI_P2(),
            P1_sub_1 : new P1_sub_1()


        }, [this, this.boss]);

        //player
        this.player = new Player(this, 200, 700, 'player', 0);
        this.playerFSM = new StateMachine("idle", {
            idle: new IdleState(),
            move: new MoveState(),
            jump: new JumpState(),
            kick: new KickState(),
            onhit: new OnHitState(),
            onhit_arrow: new OnHitState_Arrow(),
            block: new BlockState()


        }, [this, this.player]);




        //keys
        this.keys = this.input.keyboard.createCursorKeys();
        this.keys.AKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keys.DKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

        document.getElementById('info').innerHTML = '<strong>Operation:</strong> Arrows move, SPACE jump, [A] kick, [D] block\n';

    }

    update(){
        this.x_p2b = this.boss.body.x - this.player.body.x;
        this.bx = this.boss.body.x;     this.by = this.boss.body.y;
        this.px = this.player.body.x;   this.py = this.player.body.y;
        this.dir = this.x_p2b >= 0 ? 1 : -1;

        //collision
        this.physics.world.collide(this.player, this.boss, this.on_collision_pb, null, this);
        this.physics.world.collide(this.player, this.boss.projectiles, this.on_arrow_hit_player, null, this);

        //update FSM
        this.playerFSM.step();
        this.bossFSM.step();
    }

    on_collision_pb(){
        this.playerFSM.collision = true;
        this.bossFSM.collision = true;

    }

    on_arrow_hit_player(player, arrow){
        this.playerFSM.collision_arrow = true;
        arrow.setActive(false);
        arrow.setVisible(false);
        arrow.x = -50; arrow.y = -50;
    }


}
