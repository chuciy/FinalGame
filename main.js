const WIDTH = 1200;
const HEIGHT = 675;

const BMHP = 1200;
const PMHP = 600;


let game = new Phaser.Game({
    width: WIDTH,
    height: HEIGHT,
    zoom: 1,
    scene: [Start, Scene_1, Victory, Defeat],
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    }
});

//game.world.setBounds(0, 0, 2400, 675);