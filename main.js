const WIDTH = 1200;
const HEIGHT = 675;

const BMHP = 1000;
const PMHP = 1000;


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