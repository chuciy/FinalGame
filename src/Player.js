class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame); 
        scene.add.existing(this);           
        scene.physics.add.existing(this);   


        // set properties
        this.speed = 200;
        this.jumps = 2;
        this.success_block = false;
        // set physics properties
        this.setGravityY(2000);
        this.body.setCollideWorldBounds(true);
        this.setImmovable();


    }
    
    on_ground_refresh(){
        this.setGravityY(2000);
        this.jumps = 2;
        this.clearTint();
    }

    jump_cancel_refresh(){

    }

    on_hit(direction){
        //this.scene.sound.play("se0");
        this.setGravityY(2000);
        this.body.setVelocityX(500 * direction);
        this.body.setVelocityY(-1100);
        this.setTint(0x303030);
    }
    on_hit_arrow(){
        this.setGravityY(2000);
        this.body.setVelocity(-this.scene.dir * 100, 0),
        this.setTint(0xEEDD22);
    }


    jump(){
        this.jumps--;
        this.body.setVelocityY(-1000);
        this.setTint(0xFF8080);

    }
}

class IdleState extends State {
    enter(scene, self){
        self.body.setVelocity(0);
    }

    execute(scene, self){
        const { left, right, up, down, space, shift } = scene.keys;

        //collision
        if(this.stateMachine.collision){
            this.stateMachine.transition('onhit');
            return;
        }
        if(this.stateMachine.collision_arrow){
            this.stateMachine.transition('onhit_arrow');
            return;
        }



        // transition to jump if space pressed
        if(Phaser.Input.Keyboard.JustDown(space)) {
            self.jump();
            this.stateMachine.transition('jump');
            return;
        }
        // handle movement
        if(left.isDown || right.isDown || up.isDown || down.isDown ) {
            this.stateMachine.transition('move');
            return;
        }
    }

}

class MoveState extends State {
    execute(scene, self){
        const { left, right, up, down, space, shift } = scene.keys;

        //collision
        if(this.stateMachine.collision){
            this.stateMachine.transition('onhit');
            return;
        }
        if(this.stateMachine.collision_arrow){
            this.stateMachine.transition('onhit_arrow');
            return;
        }



        // transition to idle if not pressing movement keys
        if(!(left.isDown || right.isDown)) {
            this.stateMachine.transition('idle');
            return;
        }
        // transition to jump if space pressed
        if(Phaser.Input.Keyboard.JustDown(space)) {
            self.jump();
            this.stateMachine.transition('jump');
            return;
        }

        // handle movement
        if(left.isDown) {
            self.body.setVelocityX(-self.speed);
        } else if(right.isDown) {
            self.body.setVelocityX(self.speed);
        }

    }
}

class JumpState extends State {
    enter(scene, self){
    }

    execute(scene, self){
        const { left, right, up, down, space, shift } = scene.keys;
        const AKey = scene.keys.AKey;
        const DKey = scene.keys.DKey;

        //collision
        if(this.stateMachine.collision){
            this.stateMachine.transition('onhit');
            return;
        }
        if(this.stateMachine.collision_arrow){
            this.stateMachine.transition('onhit_arrow');
            return;
        }



        // transition to idle on first touching ground
        //self.body.deltaY() > 0 && 
        if(self.body.deltaY() > 0 && self.body.onFloor()){
            this.stateMachine.transition('idle');
            self.on_ground_refresh();
            return;
        }

        // Input
        if(Phaser.Input.Keyboard.JustDown(AKey)) {
            this.stateMachine.transition('kick');
            return;
        }

        if(Phaser.Input.Keyboard.JustDown(DKey)) {
            this.stateMachine.transition('block');
            return;
        }

        // Multiple jump
        if(Phaser.Input.Keyboard.JustDown(space) && self.jumps > 0) {
            self.jumps--;
            self.body.setVelocityY(-1000);
            self.setTint(0xFF0000);
            return;
        }

        // handle movement
        if(left.isDown) {
            self.body.setVelocityX(-self.speed * 1);
        } else if(right.isDown) {
            self.body.setVelocityX( self.speed * 1);
        }
    }

}


//Kick state changes gravity and it need to be set back to 2000 when entering other state
class KickState extends State {
    enter(scene, self){
        let direction = self.body.velocity.x;

        self.body.setVelocityY(800);
        self.setTint(0x3030EE);
        self.setGravityY(0);

        if(direction >= 0){     // moving right
            self.body.setVelocityX(800);
        }else{
            self.body.setVelocityX(-800);
        }
    }

    execute(scene, self){
        const { left, right, up, down, space, shift } = scene.keys;

        if(this.stateMachine.collision){
            //successfull kick 
            self.jumps++;
            this.stateMachine.transition('onhit');
            return;
        }
        if(this.stateMachine.collision_arrow){
            this.stateMachine.transition('onhit_arrow');
            return;
        }

        // transition to idle on first touching ground
        if(self.body.deltaY() > 0 && self.body.onFloor()){
            this.stateMachine.transition('idle');
            self.on_ground_refresh();
            return;
        }
    }

}

class OnHitState extends State {
    enter(scene, self){

        self.on_hit(-scene.dir);

        scene.time.delayedCall(250, () => {
            this.stateMachine.transition('jump');
            this.stateMachine.collision = false;
            self.clearTint();
        });
    }

    execute(scene, self){
        const { left, right, up, down, space, shift } = scene.keys;
    }

}

class OnHitState_Arrow extends State {
    enter(scene, self){

        self.on_hit_arrow();

        scene.time.delayedCall(100, () => {
            if(self.body.onFloor()){
                this.stateMachine.transition('idle');
            }else{
                this.stateMachine.transition('jump');
            }
            this.stateMachine.collision_arrow = false;
            self.clearTint();
        });
    }

    execute(scene, self){
        const { left, right, up, down, space, shift } = scene.keys;
    }

}

// changes gravity
class BlockState extends State {
    enter(scene, self){
        self.setVelocity(0.5 * self.body.velocity.x, 0.07 * self.body.velocity.y);
        self.setGravityY(0);
        self.setTint(0x10c688);

        scene.time.delayedCall(500, () => {
            self.setGravityY(2000);
            self.clearTint();
            this.stateMachine.collision = false;
            this.stateMachine.collision_arrow = false;
            self.success_block = false;

            if(self.body.onFloor()){
                this.stateMachine.transition('idle');
            }else{
                this.stateMachine.transition('jump');
            }
            
        });
    }

    execute(scene, self){

        if(this.stateMachine.collision && !self.success_block){
            self.setTint(0x00FF00);
            return;
        }
        if(this.stateMachine.collision_arrow && !self.success_block){
            self.setTint(0x00FFFF);
            return;
        }



    }

}