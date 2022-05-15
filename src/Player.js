class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame); 
        scene.add.existing(this);           
        scene.physics.add.existing(this);   


        // set properties
        this.speed = 200;
        this.jumps = 2;
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
        this.scene.sound.play("se0");
        this.setGravityY(2000);
        this.body.setVelocityX(500 * direction);
        this.body.setVelocityY(-1100);
        this.setTint(0x303030);
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

        //collision
        if(this.stateMachine.collision){
            this.stateMachine.transition('onhit');
            return;
        }

        // transition to idle on first touching ground
        if(self.body.deltaY() > 0 && self.body.onFloor()){
            this.stateMachine.transition('idle');
            self.on_ground_refresh();
            return;
        }

        if(Phaser.Input.Keyboard.JustDown(AKey)) {
            this.stateMachine.transition('kick');
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

        if(scene.x_p2b >= 0){
            // bounce off to left
            self.on_hit(-1);
        }else{
            self.on_hit(1);
        }

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