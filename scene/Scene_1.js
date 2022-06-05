class Scene_1 extends Phaser.Scene {
    constructor() {
        super("scene_1");
    }

    preload() {
        //this.load.image('player', 'assets/player.png');
        //this.load.image('boss', 'assets/boss.png');

        this.load.image('arrow', 'assets/arrow.png');


        this.load.audio('se0', 'assets/se0.wav');
        this.load.audio('p_dmg', 'assets/player_damage.wav');
        this.load.audio('p_death', 'assets/player_death.wav');
        this.load.audio('rb', 'assets/red_block_damage.wav');
        this.load.audio('yf', 'assets/yellow_fireball.wav');
        this.load.audio('yj', 'assets/yellow_jump.wav');
        this.load.audio('md', 'assets/magenta_dash.wav');
        this.load.audio('bd', 'assets/blue_dash.wav');
        this.load.audio('cf', 'assets/cyan_fireball.wav');
        this.load.audio('d_death', 'assets/dragon_death.wav');
        this.load.audio('d_dmg', 'assets/dragon_damage.wav');
        this.load.audio('gk', 'assets/green_kick.wav');

    }

    create() {
        this.physics.world.setFPS(60);
        //UI
        this.cameras.main.setBackgroundColor('#000000');
        this.bg = this.add.image(0, 0, 'bg').setOrigin(0, 0);
        this.p_health_bar = this.makeBar(10,20,0x2ecc71)
        this.b_health_bar = this.makeBar(680,20,0xcc2121)

        //control
        this.end = false;
        this.cam = this.cameras.main;


        //collision info
        this.x_p2b = 500;       // x distance from player to boss: boss.x - player.x
        this.px, this.py, this.bx, this.by;

        //create_animation()
        this.create_animation();

        //screen effect
        this.slash = this.add.sprite(0, 0, "slash").setOrigin(0, 0);
        this.slash.setVisible(false);

        

        //enemy
        this.boss = new Boss(this, 700, 700, 'boss_idle', 0);
        this.boss.setScale(2);
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
        this.player.setScale(2);
        this.playerFSM = new StateMachine("intro", {
            idle: new IdleState(),
            move: new MoveState(),
            jump: new JumpState(),
            kick: new KickState(),
            onhit: new OnHitState(),
            onhit_arrow: new OnHitState_Arrow(),
            block: new BlockState(),
            intro: new Intro(),
            dash: new DashState()


        }, [this, this.player]);




        //keys
        this.keys = this.input.keyboard.createCursorKeys();

        this.Keyboards = {
            W: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
            A: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            S: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
            D: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
            I: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.I),
            J: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J),
            K: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K),
            L: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.L)
        }

        //document.getElementById('info').innerHTML = '<strong>Operation:</strong> Arrows move, SPACE jump, [A] kick, [D] block\n';

    }

    update(){
        if(this.end){return;}

        if(this.player.hp <= 0){
            this.end = true;
            this.cam.pan(this.player.x, this.player.y, 2000, 'Sine.easeInOut');
            this.cam.zoomTo(1, 12);
            this.player.setVelocity(0,0);
            this.player.setGravityY(20);
            this.time.delayedCall(2000, () => {
                this.sound.play("p_death");
                this.player.anims.play("p_dead");
            });
            this.time.delayedCall(3000, () => {
                this.scene.start("defeat");  
            });
            return;
        }

        if(this.boss.hp <= 0){
            this.sound.play('d_death');
            this.boss.clearTint();
            this.end = true;
            this.cam.pan(this.boss.x, this.boss.y, 2000, 'Sine.easeInOut');
            this.cam.zoomTo(1, 10);
            this.boss.setVelocity(0,0);
            this.boss.setGravityY(-20);
            this.time.delayedCall(1500, () => {
                this.boss.setGravityY(-20);
                this.boss.clearTint();
                this.boss.anims.play("boss_death");
            });
            this.time.delayedCall(2700, () => {
                this.scene.start("victory");  
            });
            return;
        }

        //scene managed INFO to be passed to FSM
        //  -coordinates
        this.x_p2b = this.boss.body.x - this.player.body.x;
        this.bx = this.boss.body.x;     this.by = this.boss.body.y;
        this.px = this.player.body.x;   this.py = this.player.body.y;
        this.dir = this.x_p2b >= 0 ? 1 : -1;
        //  -state INFO used with collision INFO
        this.green_purple = false;
        this.blue_yellow = false;
        this.red_cyan = false;

        if(this.playerFSM.state == "dash" && this.bossFSM.state == "P1_sub_1"){
            this.blue_yellow = true;
        }
        if(this.playerFSM.state == "kick" && this.bossFSM.state == "AI_P2"){
            this.green_purple = true;
        }

        //Flipping
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
        this.physics.world.collide(this.player, this.boss.orbs, this.on_orb_hit_player, null, this);

        //update FSM
        this.playerFSM.step();
        this.bossFSM.step();


        //Ui
        this.b_health_bar.scaleX = Math.max(this.boss.hp, 0) / BMHP;
        this.p_health_bar.scaleX = Math.max(this.player.hp, 0) / PMHP;
    }

    on_collision_pb(){
        this.playerFSM.collision = true;
        this.bossFSM.collision = true;

    }

    on_arrow_hit_player(player, arrow){
        this.playerFSM.collision_arrow = true;
        arrow.setActive(false);
        arrow.setVisible(false);
        arrow.setVelocity(0,0);
        arrow.x = -50; arrow.y = -50;
    }

    on_orb_hit_player(player, orb){
        this.playerFSM.collision_orb = true;
        orb.setActive(false);
        orb.setVisible(false);
        orb.setVelocity(0,0);
        orb.x = -50; orb.y = -50;
    }

    on_reflect(){
        this.sound.play("rb");
        console.log("arrow reflected");
        this.red_cyan = true;
        this.slash.setVisible(true)
        this.slash.anims.play("slash");
        this.slash.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
            this.slash.setVisible(false);
        });
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
            key: 'boss_death',
            frames: 'boss_death',
            frameRate: 10,
            repeat: 0
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
            key: 'orb',
            frames: 'orb',
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

        this.anims.create({
            key: 'player_jump',
            frames: 'player_jump',
            frameRate: 30,
            repeat: -1
        });

        this.anims.create({
            key: 'player_block',
            frames: 'player_block',
            frameRate: 20,
            repeat: 5
        });

        this.anims.create({
            key: 'player_falling',
            frames: 'player_falling',
            frameRate: 30,
            repeat: -1
        });

        this.anims.create({
            key: 'player_kick',
            frames: 'player_kick',
            frameRate: 30,
            repeat: -1
        });

        this.anims.create({
            key: 'boss_jump',
            frames: 'boss_jump',
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'player_dash',
            frames: 'player_dash',
            frameRate: 30,
            repeat: -1
        });

        this.anims.create({
            key: 'slash',
            frames: 'slash',
            frameRate: 30,
            repeat: 0
        });

        this.anims.create({
            key: 'p_dead',
            frames: 'p_dead',
            frameRate: 8,
            repeat: 0
        });



    
    
    }

}


