class Arrows extends Phaser.Physics.Arcade.Group
{
    constructor (scene)
    {
        super(scene.physics.world, scene);

        this.createMultiple({
            frameQuantity: 20,
            key: 'arrow',
            active: false,
            visible: false,
            classType: Arrow
        });
    }

    fire_arrow (bx, by, px, py)
    {
        let arrow = this.getFirstDead(false);
        if (arrow){
            arrow.fire(bx, by, px, py);
        }
    }
}

class Arrow extends Phaser.Physics.Arcade.Sprite
{
    constructor (scene, x, y)
    {
        super(scene, x, y, 'arrow');
        this.anims.play('arrow');
    }

    fire (bx, by, px, py)
    {

        this.setScale(2);
        if(bx - px <= 0){
            this.flipX = true;
        }

        let dirX = px - bx;
        let dirY = py - by - 400 * (Math.abs(bx - px) / WIDTH) - (Math.random() - 0.5) * 150; //
        let sqrtXY = Math.sqrt(dirX * dirX + dirY * dirY);


        this.body.reset(bx+50, by+50);
        this.setActive(true);
        this.setVisible(true);

        this.setVelocityX(dirX / sqrtXY * 600);
        this.setVelocityY(dirY / sqrtXY * 600);
        this.setAccelerationY(500);
    }

    preUpdate (time, delta)
    {   
        super.preUpdate(time, delta);

        this.setRotation(Math.atan((this.body.velocity.y) / (this.body.velocity.x)));

        if (!(0 <= this.x && this.x <= WIDTH) || !(0 <= this.y && this.y <= HEIGHT))
        {
            this.setActive(false);
            this.setVisible(false);
        }

    }
}




class Orbs extends Phaser.Physics.Arcade.Group
{
    constructor (scene)
    {
        super(scene.physics.world, scene);

        this.createMultiple({
            frameQuantity: 40,
            key: 'orb',
            active: false,
            visible: false,
            classType: Orb
        });
    }

    fire_arrow (bx, by, px, py)
    {
        let arrow = this.getFirstDead(false);
        if (arrow){
            arrow.fire(bx, by, px, py);
        }
    }
}

class Orb extends Phaser.Physics.Arcade.Sprite
{
    constructor (scene, x, y)
    {
        super(scene, x, y, 'orb');
        this.anims.play('orb');
    }

    fire (bx, by, px, py)
    {

        if(bx - px <= 0){
            this.flipX = true;
        }
        
        let dirX = px - bx;
        let dirY = py - by;
        let sqrtXY = Math.sqrt(dirX * dirX + dirY * dirY);


        this.body.reset(bx+50, by+50);
        this.setActive(true);
        this.setVisible(true);

        this.setVelocityX(dirX / sqrtXY * 700);
        this.setVelocityY(dirY / sqrtXY * 700);
        this.setAccelerationY(0);
    }

    preUpdate (time, delta)
    {   
        super.preUpdate(time, delta);

        this.setRotation(Math.atan((this.body.velocity.y) / (this.body.velocity.x)));

        if (!(0 <= this.x && this.x <= WIDTH) || !(0 <= this.y && this.y <= HEIGHT))
        {
            this.setActive(false);
            this.setVisible(false);
        }

    }
}