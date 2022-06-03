class Boss extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame); 
        scene.add.existing(this);           
        scene.physics.add.existing(this);   


        // set properties
        this.hp = 1000;
        this.shoot_cd = 600; //ms
        this.can_shoot = true;

        this.ultra_cd = 500;
        this.can_ultra = false;

        this.projectiles = new Arrows(scene);
        this.orbs = new Orbs(scene);



        // set physics properties
        this.setGravityY(2000);
        this.body.setCollideWorldBounds(true);
        this.setImmovable();


        //states
        this.BASIC_STATES = {
            idle: 'idle_boss',
            AI_P1: 'AI_P1',
            AI_P2: "AI_P2"
        }

        this.COLORS = {
            white: 0xFFFFFF,
            grey: 0x808080,
            magenta: 0xE040E0,
            cyan: 0x40E0E0,
            yellow: 0xE0E040,
            dark: 0x101010,
        }
        this.basic_state = this.BASIC_STATES.idle;

        this.in_behavior = false;
    }

    on_hit(direction){
        if(this.scene.blue_yellow){
            console.log("Successful Counter Attack of Blue->Yellow!");
            this.hp -= 200;
            this.setGravityY(2000);
            this.body.setVelocityX(300 * direction);
            this.setTint(this.COLORS.white);
        }else{
            this.hp -= 100;
            this.setGravityY(2000);
            this.body.setVelocityX(200 * direction);
            this.setTint(this.COLORS.dark);
        }
    }
}

class IdleState_Boss extends State {
    enter(scene, self){
        self.anims.play("boss_idle", true);
        console.log("in_idle");
        this.basic_state = self.BASIC_STATES.idle;
        self.setTint(self.COLORS.grey);
       
    }

    execute(scene, self){
        const { left, right, up, down, space, shift } = scene.keys;
        //collision
        if(this.stateMachine.collision){
            this.stateMachine.transition('onhit_boss');
            return;
        }

        //
        if(!self.in_behavior){
            self.in_behavior = true;
            scene.time.delayedCall(800, () => {
                self.in_behavior = false;
            });

            let rdm = Math.random();
            if(rdm >= 0.33){
                this.stateMachine.transition('AI_P1');
            }else if(rdm >= 0.11){
                this.stateMachine.transition('AI_P2');
            }else{
                console.log("idle_move");
                self.anims.play("boss_walk", true);
                self.setVelocityX((Math.random() - 0.5) * 700);
            }
        }else{
            self.body.velocityX *= 0.5; // ???not working??
        }
        //
        
    }

}

class AI_P1 extends State {
    enter(scene, self){
        this.basic_state = self.BASIC_STATES.AI_P1;
        self.anims.play("boss_walk", true);
        console.log("Enter Basic_state: " + this.basic_state);
        self.setTint(self.COLORS.cyan);

        self.in_behavior = true;
        scene.time.delayedCall(2500, () => {
            self.in_behavior = false;
        });

    }

    execute(scene, self){
        if(this.stateMachine.collision){
            this.stateMachine.transition('onhit_boss');
            return;
        }


        //Default behavior always activated in P1 state:
        //try to keep certain distance with player
        let dx = Math.abs(scene.x_p2b);
        if(dx <= 500){
            self.setVelocityX((1 - dx/500) * scene.dir * 500 + 20);
        }else{
            self.setVelocityX(-scene.dir * (dx - 300) * 0.8 + 20);
        }
        //Shoot arrows in parabola
        if(self.can_shoot){
            self.projectiles.fire_arrow(scene.bx, scene.by, scene.px, scene.py);
            self.can_shoot = false;
            scene.time.delayedCall(self.shoot_cd, () => {
                self.can_shoot = true;
            });
        }

        //Random decision
        if(!self.in_behavior){
            self.in_behavior = true;
            scene.time.delayedCall(4000, () => {
                self.in_behavior = false;
            });

            let rdm = Math.random();
            if(rdm >= 0.5){
                this.stateMachine.transition('idle_boss');
            }else{
                this.stateMachine.transition('P1_sub_1');
            }
        }
    }

}


// This becomes the 3rd main state!
// just too lazy to fix the naming
class P1_sub_1 extends State {
    enter(scene, self){
        console.log("p1_sub1");
        self.anims.play("boss_jump");
        self.setVelocity(300 * scene.dir, -1200);
        self.setTint(self.COLORS.yellow);

        self.setGravityY(0);

        self.can_ultra = false;
        scene.time.delayedCall(1250, () => {
            self.can_ultra = true;
            self.setVelocity(100 * scene.dir, 0);

        });


        scene.time.delayedCall(4000, () => {
            self.in_behavior = true;
            scene.time.delayedCall(4000, () => {
                self.in_behavior = false;
            });
            self.setGravityY(2000);
            this.stateMachine.transition('idle_boss');
        });
    }

    execute(scene, self){
        //collision
        if(this.stateMachine.collision){
            this.stateMachine.transition('onhit_boss');
            return;
        }

        if(self.y <= 200){
            self.setVelocityY(0);
            self.y = 200;
        }

        if(self.can_ultra){
            let rx = 1200 - scene.px; let ry = 675 - scene.px;
            const NUM = 4;
            for(let i = 0; i != NUM; i++){
                self.orbs.fire_arrow(scene.bx, scene.by, scene.px / NUM * i, scene.py / NUM * i);
                self.orbs.fire_arrow(scene.bx, scene.by, scene.px + (rx / NUM * i), scene.py + (ry / NUM * i));
            }

            self.can_ultra = false;
            scene.time.delayedCall(self.shoot_cd * 1.8, () => {
                self.can_ultra = true;
            });
        }

    }
}
class OnHitState_Boss extends State {
    enter(scene, self){

        if(scene.x_p2b >= 0){
            // bounce off to right
            self.on_hit(1);
        }else{
            self.on_hit(-1);
        }

        scene.time.delayedCall(250, () => {
            console.log("Collide! Now back to: " + self.basic_state);
            this.stateMachine.transition(self.basic_state);
            this.stateMachine.collision = false;
            self.setTint(self.COLORS.grey);
        });
    }

    execute(scene, self){
    }

}

class AI_P2 extends State {
    enter(scene, self){
        self.anims.play("boss_walk", true);
        this.basic_state = self.BASIC_STATES.AI_P2;
        console.log("Enter Basic_state: " + this.basic_state);
        self.setTint(self.COLORS.magenta);

    }

    execute(scene, self){
        if(this.stateMachine.collision){
            this.stateMachine.transition('onhit_boss');
            return;
        }


        //Default behavior always activated in P2 state:
        //try to approch player
        let dx = Math.max(Math.abs(scene.x_p2b) , 400) / 400;
        self.setVelocityX(-scene.dir * dx * dx * 350);


        //Random decision
        if(!self.in_behavior){
            self.in_behavior = true;
            scene.time.delayedCall(2000, () => {
                self.in_behavior = false;
            });

            let rdm = Math.random();
            if(rdm >= 0.66){
                this.stateMachine.transition('AI_P1');
            }else{
                //test
                console.log("p2_sub1");
                self.setVelocity((Math.random() - 0.5) * 200, -500);
            }
        }
    }

}

class Intro_Boss extends State {
    enter(scene, self){
        console.log("in");
        self.x = 1200;
        self.y = 0;
        self.setVelocityX(-200);
        self.setTint(self.COLORS.dark);

        scene.time.delayedCall(1000, () => {
            self.setTint(self.COLORS.grey);
            this.stateMachine.transition('idle_boss');
        });
    }
    
    execute(scene, self){

    }

}