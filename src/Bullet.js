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
    }

    fire (bx, by, px, py)
    {

        let dirX = px - bx;
        let dirY = py - by - 400 * (Math.abs(bx - px) / WIDTH) - (Math.random() - 0.5) * 150; //
        let sqrtXY = Math.sqrt(dirX * dirX + dirY * dirY);


        this.body.reset(bx+50, by+50);
        this.setActive(true);
        this.setVisible(true);

        this.setVelocityX(dirX / sqrtXY * 800);
        this.setVelocityY(dirY / sqrtXY * 800);
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