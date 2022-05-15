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
    
    on_ground_refresh(){
        this.setGravityY(2000);
        this.jumps = 2;
        this.clearTint();
    }

    jump_cancel_refresh(){

    }
}