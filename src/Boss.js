class Boss extends Phaser.Physics.Arcade.Sprite {
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

    on_hit(direction){
        this.setGravityY(2000);
        this.body.setVelocityX(200 * direction);
        this.setTint(0xFF1010);
    }
}

class IdleState_Boss extends State {
    enter(scene, self){
        self.body.setVelocity(0);
       
    }

    execute(scene, self){
        const { left, right, up, down, space, shift } = scene.keys;
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
        const { left, right, up, down, space, shift } = scene.keys;
    }

}