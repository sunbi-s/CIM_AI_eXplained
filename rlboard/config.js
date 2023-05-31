export default [
    {
        "nodes": [  // [position, reward, final, path]
            // position: [y, x]
            // reward: float
            // final: boolean
            // path: string
            [[4, 2], -0.5, false, "img/rlboard/place/Net.png"],
            [[4, 1], -2, false, "img/rlboard/place/Dynamite.png"],
            [[5, 0], -0.5, false, "img/rlboard/place/Net.png"],
            [[3, 4], -5, false, "img/rlboard/place/Bomb.png"],
            [[2, 5], -2, false, "img/rlboard/place/Dynamite.png"],
            [[1, 3], -0.5, false, "img/rlboard/place/Net.png"],
            [[5, 5], 0, true, "img/rlboard/place/Treasure.png"],
        ],
        "defaultReward": -0.1,
        "boardShape": [6, 6],  // [height, width]
        "agentStartPosition": [0, 0],  // [x, y]
        "agentImagePath": [
            "img/rlboard/player/Shark_00.png",
            "img/rlboard/player/Shark_01.png",
            "img/rlboard/player/Shark_02.png",
            "img/rlboard/player/Shark_03.png",
            "img/rlboard/player/Shark_04.png",
            "img/rlboard/player/Shark_05.png",
            "img/rlboard/player/Shark_06.png",
            "img/rlboard/player/Shark_07.png",
            "img/rlboard/player/Shark_08.png",
            "img/rlboard/player/Shark_09.png",
            "img/rlboard/player/Shark_10.png",
            "img/rlboard/player/Shark_11.png",
            "img/rlboard/player/Shark_12.png",
            "img/rlboard/player/Shark_13.png",
            "img/rlboard/player/Shark_14.png",
            "img/rlboard/player/Shark_15.png",
            "img/rlboard/player/Shark_16.png",
            "img/rlboard/player/Shark_17.png",
            "img/rlboard/player/Shark_18.png",
            "img/rlboard/player/Shark_19.png",
        ]
    },
];
