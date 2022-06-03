class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame); 
        scene.add.existing(this);           
        scene.physics.add.existing(this);   


        // set properties
        this.hp = 1000;
        this.speed = 200;
        this.jumps = 2;
        this.success_block = false;
        this.falling = false;
        // set physics properties
        this.setGravityY(2000);
        this.body.setCollideWorldBounds(true);
        this.setImmovable();

        //state related
        this.GENERAL_STATES = {
            free: 'free',
            kick: 'kick',
            other: "other"
        }
        this.general_state = this.GENERAL_STATES.free;


        this.COLORS = {
            white: 0xFFFFFF,
            grey: 0x808080,
            red: 0xF04040,
            green: 0x40F040,
            blue: 0x4040F0,
            dark: 0x101010
        }
    }
    
    on_ground_refresh(){
        this.setGravityY(2000);
        this.falling = false;
        this.jumps = 2;
        this.setTint(this.COLORS.grey);
    }

    jump_cancel_refresh(){
        console.log("you just triggered what is called jc");
    }

    on_hit(direction){
        //this.scene.sound.play("se0");
        if(this.general_state != this.GENERAL_STATES.kick){
            this.hp -= 100;
        }
        
        this.setGravityY(2000);
        this.body.setVelocityX(500 * direction);
        this.body.setVelocityY(-1100);
        this.setTint(this.COLORS.dark);
    }
    on_hit_arrow(){
        this.hp -= 50;
        this.setGravityY(2000);
        this.body.setVelocity(-this.scene.dir * 100, 0),
        this.setTint(this.COLORS.dark);
    }

    on_hit_orb(){
        /*
        this.hp -= 30;
        this.setGravityY(2000);
        this.body.setVelocity(-this.scene.dir * 50, 0),
        this.setTint(0xDEDE22);
        */
    }


    jump(){
        this.jumps--;
        this.anims.play("player_jump");
        this.body.setVelocityY(-1000);
        this.setTint(this.COLORS.grey);

    }
}

class IdleState extends State {
    enter(scene, self){
        self.anims.play("player_idle");
        self.body.setVelocity(0);
        self.general_state = self.GENERAL_STATES.free;
    }

    execute(scene, self){
        const { left, right, up, down, space, shift } = scene.keys;
        const AKey = scene.keys.AKey;
        const DKey = scene.keys.DKey;
        const EKey = scene.keys.EKey;

        //collision
        if(this.stateMachine.collision){
            this.stateMachine.transition('onhit');
            return;
        }
        if(this.stateMachine.collision_arrow || this.stateMachine.collision_orb){
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

        if(Phaser.Input.Keyboard.JustDown(DKey)) {
            this.stateMachine.transition('block');
            return;
        }
    }

}

class MoveState extends State {
    enter(scene, self){
        self.anims.play("player_running");
        self.general_state = self.GENERAL_STATES.free;
    }
    execute(scene, self){
        const { left, right, up, down, space, shift } = scene.keys;
        const AKey = scene.keys.AKey;
        const DKey = scene.keys.DKey;
        const EKey = scene.keys.EKey;

        //collision
        if(this.stateMachine.collision){
            this.stateMachine.transition('onhit');
            return;
        }
        if(this.stateMachine.collision_arrow || this.stateMachine.collision_orb){
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
        //
        if(Phaser.Input.Keyboard.JustDown(DKey)) {
            this.stateMachine.transition('block');
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
        self.general_state = self.GENERAL_STATES.free;
    }

    execute(scene, self){
        const { left, right, up, down, space, shift } = scene.keys;
        const AKey = scene.keys.AKey;
        const DKey = scene.keys.DKey;
        const EKey = scene.keys.EKey;

        //collision
        if(this.stateMachine.collision){
            this.stateMachine.transition('onhit');
            return;
        }
        if(this.stateMachine.collision_arrow || this.stateMachine.collision_orb){
            this.stateMachine.transition('onhit_arrow');
            return;
        }

        //falling animation
        if(!self.falling && self.body.velocity.y > 0){
            self.falling = true;
            self.anims.play("player_falling");
        }


        // transition to idle on first touching ground
        //self.body.deltaY() > 0 && 
        if(self.body.deltaY() > 0 && self.body.onFloor()){
            this.stateMachine.transition('idle');
            self.on_ground_refresh();
            return;
        }

        // --------------------------------------Entering Three states:-----------------------------------------------
        if(Phaser.Input.Keyboard.JustDown(AKey)) {
            this.stateMachine.transition('kick');
            return;
        }

        if(Phaser.Input.Keyboard.JustDown(DKey)) {
            this.stateMachine.transition('block');
            return;
        }
        if(Phaser.Input.Keyboard.JustDown(EKey)) {
            this.stateMachine.transition('dash');
            return;
        }


        // Multiple jump
        if(Phaser.Input.Keyboard.JustDown(space) && self.jumps > 0) {
            self.jump();

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
        self.general_state = self.GENERAL_STATES.kick;

        let direction = self.body.velocity.x;

        self.body.setVelocityY(800);
        self.setTint(self.COLORS.green);
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
        if(this.stateMachine.collision_arrow || this.stateMachine.collision_orb){
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
        self.anims.play("player_falling");

        scene.time.delayedCall(250, () => {
            this.stateMachine.transition('jump');
            this.stateMachine.collision = false;
            self.setTint(self.COLORS.grey);
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
            this.stateMachine.collision_orb = false;
            self.setTint(self.COLORS.grey);
        });
    }

    execute(scene, self){
        const { left, right, up, down, space, shift } = scene.keys;
    }

}

// changes gravity
class BlockState extends State {
    enter(scene, self){
        self.general_state = self.GENERAL_STATES.other;

        self.setVelocity(0.5 * self.body.velocity.x, 0.07 * self.body.velocity.y);
        self.setGravityY(0);
        self.setTint(self.COLORS.red);

        scene.time.delayedCall(500, () => {
            self.setGravityY(2000);
            self.setTint(self.COLORS.grey);
            this.stateMachine.collision = false;
            this.stateMachine.collision_arrow = false;
            this.stateMachine.collision_orb = false;
            self.success_block = false;

            if(self.body.onFloor()){
                this.stateMachine.transition('idle');
            }else{
                this.stateMachine.transition('jump');
            }
        });
    }

    execute(scene, self){
        if( (this.stateMachine.collision_orb || this.stateMachine.collision) && !self.success_block){
            self.success_block = true;
            self.setTint(self.COLORS.red);
            self.setVelocityX(-scene.dir * 800);
            return;
        }
        if(this.stateMachine.collision_arrow && !self.success_block){
            self.anims.play("block_success");
            self.success_block = true;
            scene.on_reflect();
            self.setTint(self.COLORS.red);
            return;
        }
    }

}


// changes gravity
class DashState extends State {
    enter(scene, self){
        self.general_state = self.GENERAL_STATES.other;

        self.setVelocity(scene.dir * 1000, 0);
        self.setGravityY(0);
        self.setTint(self.COLORS.blue);

        self.anims.play("player_dash");


        scene.time.delayedCall(700, () => {
            self.setGravityY(2000);
            self.setTint(self.COLORS.grey);
            this.stateMachine.collision = false;
            this.stateMachine.collision_arrow = false;
            this.stateMachine.collision_orb = false;
            self.success_block = false;

            if(self.body.onFloor()){
                this.stateMachine.transition('idle');
            }else{
                this.stateMachine.transition('jump');
            }

        });
    }

    execute(scene, self){
        if(this.stateMachine.collision_arrow){
            this.stateMachine.transition('onhit_arrow');
        }else if(this.stateMachine.collision){
            this.stateMachine.transition('onhit');
        }else if(this.stateMachine.collision_orb){

        }
    }

}

class Intro extends State {
    enter(scene, self){
        self.x = 50;
        self.y = 150;
        self.setVelocityX(200);
        self.setTint(self.COLORS.dark);

        scene.time.delayedCall(1000, () => {
            self.setTint(self.COLORS.grey);
            if(self.body.onFloor()){
                this.stateMachine.transition('idle');
            }else{
                this.stateMachine.transition('jump');
            }
        });
    }

    execute(scene, self){

    }

}