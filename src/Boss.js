class Boss extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame); 
        scene.add.existing(this);           
        scene.physics.add.existing(this);   


        // set properties
        this.shoot_cd = 1000; //ms
        this.can_shoot = true;
        this.projectiles = new Arrows(scene);



        // set physics properties
        this.setGravityY(2000);
        this.body.setCollideWorldBounds(true);
        this.setImmovable();


        //states
        this.states = ['AI_P1', 'AI_P2'];
        this.in_behavior = false;
    }

    on_hit(direction){
        this.setGravityY(2000);
        this.body.setVelocityX(200 * direction);
        this.setTint(0xFF1010);
    }
}

class IdleState_Boss extends State {
    enter(scene, self){
        console.log("idle");
        self.clearTint();
       
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
            scene.time.delayedCall(2000, () => {
                self.in_behavior = false;
            });

            let rdm = Math.random();
            if(rdm >= 0.5){
                this.stateMachine.transition('AI_P1');
            }else{
                console.log("idle_move");
                self.setVelocityX((Math.random() - 0.5) * 700);
            }
        }
        //
        
    }

}

class AI_P1 extends State {
    enter(scene, self){
        console.log("Ai_p1");
        self.setTint(0x00FFFF);

    }

    execute(scene, self){
        if(this.stateMachine.collision){
            this.stateMachine.transition('onhit_boss');
            return;
        }

        //try to keep certain distance with player
        let dx = Math.abs(scene.x_p2b);
        if(dx <= 500){
            self.setVelocityX((1 - dx/500) * scene.dir * 500);
        }else{
            self.setVelocityX(-scene.dir * (dx - 300) * 0.8);
        }


        if(self.can_shoot){
            self.projectiles.fire_arrow(scene.bx, scene.by, scene.px, scene.py);
            self.can_shoot = false;
            scene.time.delayedCall(self.shoot_cd, () => {
                self.can_shoot = true;
            });
        }

        //
        if(!self.in_behavior){
            self.in_behavior = true;
            scene.time.delayedCall(2000, () => {
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

class P1_sub_1 extends State {
    enter(scene, self){
        console.log("p1_sub1");
        self.setVelocity(300 * scene.dir, -1200);
        self.setTint(0x66FF22);
        scene.time.delayedCall(1000, () => {
            this.stateMachine.transition('AI_P1');
        });
    }

    execute(scene, self){
         //collision
         if(this.stateMachine.collision){
            this.stateMachine.transition('onhit_boss');
            return;
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
            this.stateMachine.transition('idle_boss');
            this.stateMachine.collision = false;
            self.clearTint();
        });
    }

    execute(scene, self){
    }

}