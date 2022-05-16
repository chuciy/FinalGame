const WIDTH = 1200;
const HEIGHT = 675;



let game = new Phaser.Game({
    width: WIDTH,
    height: HEIGHT,
    //zoom: 1,
    scene: [Scene_1],
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    }
});

