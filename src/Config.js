import LoadingScene from "./scenes/LoadingScene";
import PlayingScene from "./scenes/PlayingScene";
// import MainScene from "./scenes/MainScene";
// import PlayingScene from "./scenes/PlayingScene";
// import GameoverScene from "./scenes/GameoverScene";

const Config = {
    // 맵 크기
    width: 6000 ,
    height: 3000,
    backgroundColor: 0x000000,
    scene: [LoadingScene, PlayingScene],
    pixelArt: true,
    physics: {
        default: "arcade",
        arcade: {
            debug: process.env.DEBUG === "true",
        },
    },
};

export default Config;
