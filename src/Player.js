// Hero prefab
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


    }
}

class IdleState extends State {
    enter(scene, self){
        self.body.setVelocity(0);
    }

    execute(scene, self){
        const { left, right, up, down, space, shift } = scene.keys;

        // transition to jump if space pressed
        if(Phaser.Input.Keyboard.JustDown(space)) {
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

        // transition to idle if not pressing movement keys
        if(!(left.isDown || right.isDown)) {
            this.stateMachine.transition('idle');
            return;
        }
        // transition to jump if space pressed
        if(Phaser.Input.Keyboard.JustDown(space)) {
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
        self.jumps--;
        self.body.setVelocityY(-1000);
        self.setTint(0xFF8080);
    }

    execute(scene, self){
        const { left, right, up, down, space, shift } = scene.keys;
        const AKey = scene.keys.AKey;

        // transition to idle on first touching ground
        if(self.body.deltaY() > 0 && self.body.onFloor()){
            this.stateMachine.transition('idle');
            self.jumps = 2;
            self.clearTint();
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

        // handle movement, allowing slower adjustment in direction
        if(left.isDown) {
            self.body.setVelocityX(-self.speed * 0.75);
        } else if(right.isDown) {
            self.body.setVelocityX( self.speed * 0.75);
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

        // transition to idle on first touching ground
        if(self.body.deltaY() > 0 && self.body.onFloor()){
            this.stateMachine.transition('idle');
            self.jumps = 2;
            self.clearTint();
            self.setGravityY(2000);
            return;
        }
    }

}