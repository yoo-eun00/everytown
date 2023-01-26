export default class Marker extends Phaser.Physics.Arcade.Image {

    constructor(scene) {
        super(scene,-50,-50,"marker");
        this.scale = 0.1;
        this.alpha = 1;

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setInteractive();
        this.once('pointerup',this.popUp,scene)
    }

    popUp (x,y) {

        let board = this.add.sprite(this.m_player.getCenter().x,this.m_player.getCenter().y,"board");
    }


      }
