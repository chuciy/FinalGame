let game = new Phaser.Game({
    width: 1200,
    height: 900,
    //zoom: 1,
    scene: [Scene_1],
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    }
});
