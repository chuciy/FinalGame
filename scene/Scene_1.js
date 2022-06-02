class Scene_1 extends Phaser.Scene {
    constructor() {
        super("scene_1");
    }

    preload() {
        //this.load.image('player', 'assets/player.png');
        //this.load.image('boss', 'assets/boss.png');

        this.load.image('arrow', 'assets/arrow.png');


        this.load.audio('se0', 'assets/se0.wav');
    }

    create() {
        this.physics.world.setFPS(60);
        //UI
        this.cameras.main.setBackgroundColor('#DDDDDD');
        this.p_health_bar = this.makeBar(10,20,0x2ecc71)
        this.b_health_bar = this.makeBar(680,20,0xcc2121)

        //collision info
        this.x_p2b = 500;       // x distance from player to boss: boss.x - player.x
        this.px, this.py, this.bx, this.by;

        //create_animation()
        this.create_animation();

        //enemy
        this.boss = new Boss(this, 700, 700, 'boss_idle', 0);
        this.boss.setScale(1.75);
        this.bossFSM = new StateMachine("intro_boss", {
            idle_boss: new IdleState_Boss(),
            onhit_boss : new OnHitState_Boss(),
            AI_P1 : new AI_P1(),
            AI_P2 : new AI_P2(),
            P1_sub_1 : new P1_sub_1(),
            intro_boss: new Intro_Boss


        }, [this, this.boss]);

        //player
        this.player = new Player(this, 200, 700, 'player_idle', 0);
        this.player.setScale(1.25);
        this.playerFSM = new StateMachine("intro", {
            idle: new IdleState(),
            move: new MoveState(),
            jump: new JumpState(),
            kick: new KickState(),
            onhit: new OnHitState(),
            onhit_arrow: new OnHitState_Arrow(),
            block: new BlockState(),
            intro: new Intro()


        }, [this, this.player]);




        //keys
        this.keys = this.input.keyboard.createCursorKeys();
        this.keys.AKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keys.DKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

        //document.getElementById('info').innerHTML = '<strong>Operation:</strong> Arrows move, SPACE jump, [A] kick, [D] block\n';

    }

    update(){
        if(this.boss.hp <= 0 || this.player.hp <= 0){
            this.scene.start("victory");    
        }

        this.x_p2b = this.boss.body.x - this.player.body.x;
        this.bx = this.boss.body.x;     this.by = this.boss.body.y;
        this.px = this.player.body.x;   this.py = this.player.body.y;
        this.dir = this.x_p2b >= 0 ? 1 : -1;
        if(this.dir == -1 && this.x_p2b <= -50){
            this.boss.flipX = true;
            this.player.flipX = true;
        }else if(this.dir == 1 && this.x_p2b >= 50){
            this.boss.flipX = false;
            this.player.flipX = false;
        }

        //collision
        this.physics.world.collide(this.player, this.boss, this.on_collision_pb, null, this);
        this.physics.world.collide(this.player, this.boss.projectiles, this.on_arrow_hit_player, null, this);

        //update FSM
        this.playerFSM.step();
        this.bossFSM.step();


        //Ui
        this.b_health_bar.scaleX = Math.max(this.boss.hp, 0) / 1000;
        this.p_health_bar.scaleX = Math.max(this.player.hp, 0) / 1000;
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
    on_reflect(){
        console.log("arrow reflected");
    }



    makeBar(x, y,color) {
        //draw the bar
        let bar = this.add.graphics();

        //color the bar
        bar.fillStyle(color, 1);

        //fill the bar with a rectangle
        bar.fillRect(0, 0, 500, 25);
        
        //position the bar
        bar.x = x;
        bar.y = y;

        //return the bar
        return bar;
    }

    create_animation() {
        this.anims.create({
            key: 'boss_idle',
            frames: 'boss_idle',
            frameRate: 5,
            repeat: -1
        });
        this.anims.create({
            key: 'boss_walk',
            frames: 'boss_walk',
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'arrow',
            frames: 'arrow',
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'player_idle',
            frames: 'player_idle',
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'player_running',
            frames: 'player_running',
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'block_success',
            frames: 'block_success',
            frameRate: 20,
            repeat: 0
        });
    
    
    }

}


