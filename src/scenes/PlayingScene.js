import Phaser from 'phaser';
import Config from "../Config";
import Player, { Direction } from '../characters/Player';
import Structure from '../objects/Tower';
import * as phaser from "phaser";
import axios, {create} from "axios";
import Marker from "../marker/Marker.js";


export default class PlayingScene extends Phaser.Scene {



    triggerTimer = phaser.Time.TimerEvent;
    constructor() {
        super("playGame");
    }

    exit(){

    }

    create() {

        this.playList = []
        // sound
        this.sound.pauseOnBlur = false;
        this.m_beamSound = this.sound.add("audio_beam");
        this.m_explosionSound = this.sound.add("audio_explosion");
        this.m_pickupSound = this.sound.add("audio_pickup");
        this.m_hurtSound = this.sound.add("audio_hurt");
        this.m_gameoverSound = this.sound.add("audio_gameover");
        this.m_pauseInSound = this.sound.add("pause_in");
        this.m_pauseOutSound = this.sound.add("pause_out");
        this.m_hitEnemySound = this.sound.add("hit_enemy");

        // background
        this.m_background = this.add.tileSprite(0, 0, Config.width, Config.height, "background");
        this.m_background.setOrigin(0, 0);
        //minimap
       // this.minimap = this.cameras.add(10, 10, 500, 500).setZoom(0.2).setName('mini');
       // this.minimap.setBackgroundColor(0x002244);
   //     this.minimap.scrollX = 1600;
      //  this.minimap.scrollY = 300;
        // player
        //this.m_player = new Player(this);
        this.m_player = new Player(this);
        this.resetCharacter();

        this.cameras.main.setBounds(0, 0, 3000, 2121);
        //this.m_player.add(new Player(this));
        this.cameras.main.startFollow(this.m_player);
        //this.cameras.main.setSize(200,200);
        this.cameras.main.setZoom(10,10);
        //this.cameras.main.setSize(3000,2000)
        //this.cameras.resize(200 ,200);
        //this.cameras.onResize(200,200);
        // keys
        this.m_cursorKeys = this.input.keyboard.createCursorKeys();
        console.log(this.m_cursorKeys);
        //Object
        this.m_tower = new Structure(this);



//        {
//           this.input.on("drag", function (pointer, drag_marker, dragX, dragY) {
//                             drag_marker.x = dragX;
//                             drag_marker.y = dragY;
//                           });
//
//        }

        this.load.image('marker','../assets/images/destination.png','../assets/images/destination.png.json')
        {



            // for (var i = 0; i < 64; i++)
            // {
             var test = new Marker(this);
             test.setInteractive();
             test.once('pointerup',this.popUp,this)

            // }


               this.Marker = new Marker(this);
               let setDirection = { x: 700, y: 700 };

                var setImage = this.add.image(setDirection.x, setDirection.y, 'marker').setInteractive()
                var image = this.add.image(setDirection.x, setDirection.y, 'marker').setInteractive();
//                var test = this.createMarker = new createMarker(this);
//                var test = new createMarker(this);

                image.scale = 0.1;
                setImage.scale = 0.1;
//                test.scale = 0.1;
                this.input.setDraggable(image);
                this.input.topOnly = true;

                this.input.on("drag", function ( pointer, drag_marker, dragX, dragY) {
                  drag_marker.x = dragX;
                  drag_marker.y = dragY;

//                 this.add.image( dragX, dragY, 'marker').setInteractive();
                });

                this.input.on("dragend", function (pointer,gameObject) {


                    test.x = gameObject.x;
                    test.y = gameObject.y;


                    gameObject.x = setDirection.x;
                    gameObject.y = setDirection.y;

                });
        }

        this.getMarker();


        this.physics.add.collider
        (   this.m_player, this.m_tower,
            this.Marker);
        this.resources = 0;
        this.timer = 0;

        window.onbeforeunload = function(e) {
            socket.emit('leaveGame', playerName);
        };

    }

    popUp () {
        let board = this.add.sprite(this.m_player.getCenter().x,this.m_player.getCenter().y,"board");
    }
    state = {
        arr:[]
    }
    timerEvent(resources) {
        axios.defaults.withCredentials = true;
        if(resources>200) {
            axios.get('http://10.188.191.212:7777/users' ,
                {'Access-Control-Allow-Credentials': '*'},{
                withCredentials: true,
            }).then(res => {
                this.treatData(res.data)
                this.postPosision();
            }).catch(error => {
                console.log('erro', error);
            })
        }
    }

    postPosision(){
        axios.post('http://10.188.191.212:7777/users/save' ,{
            "nickname" : this.m_player.name,
            "point" : {
                "x" : this.m_player.getBottomCenter().x,
                "y" : this.m_player.getBottomCenter().y
            }
        },{
            withCredentials: true,
        }).then(res => {
            //console.log('succes');
        }).catch(error => {
            console.log('erro', error);
        })
    }

    async resetCharacter(){
        let promise = new Promise((resolve, reject) => {
            setTimeout(() => resolve("완료!"), 1000)
        });

        axios.get('http://10.188.191.212:7777/create_userName' ,
            {'Access-Control-Allow-Credentials': '*'},{
                withCredentials: true,
            }).then(res => {
                const tmp = JSON.stringify(res.data);
                this.m_player.setName(JSON.parse(tmp).nickname);
        }).catch(error => {
            console.log('WTF', error);
        });
        this.m_player.setPosition(800,800)

        let result = await promise; // 프라미스가 이행될 때까지 기다림 (*)

        axios.post('http://10.188.191.212:7777/users/save' ,{
            "nickname" : this.m_player.name,
                "point" : {
                "x" : 800,
                    "y" : 800
            }
        },{
                withCredentials: true,
            }).then(res => {
            //console.log('succes');
        }).catch(error => {
            console.log('erro', error);
        })

    }


    async treatData(res){
        const tmp = JSON.stringify(res)
        const myObj = JSON.parse(tmp);
        var len = myObj.length
        for(var i = 0; i <len; i++) {
            var tmpName = myObj[i].nickname
            var tmpX = myObj[i].point.x
            var tmpY = myObj[i].point.y
            if(tmpName === this.m_player.name) {
                continue;
            }
            var found = this.playList.find(element => element.name == tmpName);
            if(found == undefined){
                var nP = new Player(this);
                nP.setName(tmpName);
                nP.setPosition(tmpX,tmpY)
                this.playList.push(nP);
            }
            else{
                found.setPosition(tmpX,tmpY);
            }
            /***
            if(!this.playList.){
                var nP = new Player(this);
                nP.setName(tmpName);
                nP.setPosition(tmpX,tmpY)
                this.playList.push(nP);
            }
            else {
                var found = playList.find(element => element.name == tmpName);
                found.setPosition(tmpX,tmpY)
            }
             ***/
        }
    }

    getMarker() {
        axios.get('http://localhost:7777/marker/all' , {},{})
            .then(res => {
            this.markers(res.data);
            }).catch(error => {
            console.log('erro', error);
            })

    }

    markers(res){
        const tmp2 = JSON.stringify(res)
        const myObj2 = JSON.parse(tmp2);
        var len2 = myObj2.length
        for(var i = 0; i <len2; i++) {
            var tmpName2 = myObj2[i].id
            var tmpX2 = myObj2[i].point.x
            var tmpY2 = myObj2[i].point.y
            var type =  myObj2[i].type
            if(type === 'talk' ) {
                var tmpMarker =new Marker(this);
                tmpMarker.setPosition(tmpX2,tmpY2);

            }


    }

    // postMarker(){
    //     axios.post('http://10.188.191.212:7777//marker/allTalk' ,{
    //         "id" : test,
    //         "point" : {
    //             "x" : test.getBottomCenter().x,
    //             "y" : test.getBottomCenter().y
    //         },
    //         "type" : ""
    //     },{
    //         withCredentials: true,
    //     }).then(res => {
    //         //console.log('succes');
    //     }).catch(error => {
    //         console.log('erro', error);
    //     })
    // }


//    update() {
//
//        this.resources += 1;
//        this.handlePlayerMove();
//        this.timerEvent(this.resources)
//    }

    //////////////////////// FUNCTIONS ////////////////////////

    // handlePlayerMove() {
    //     if (this.m_cursorKeys.left.isDown) {
    //         this.m_player.move(Direction.Left);
    //     } else if (this.m_cursorKeys.right.isDown) {
    //         this.m_player.move(Direction.Right);
    //     }
    //
    //     if (this.m_cursorKeys.up.isDown) {
    //         this.m_player.move(Direction.Up);
    //     } else if (this.m_cursorKeys.down.isDown) {
    //         this.m_player.move(Direction.Down);
    //     }
    }




        // for (var i = 0; i < 64; i++)
        // {
        //     var x = -50;
        //     var y = -50;
        //     var moveImage = this.add.image(x, y, 'camp').setInteractive();
        // }
        //  Grab everything under the pointer






}
