export default [
    {
        "backgroundImagePath": "img/rlboard/background.png",
        "nodes": [
            // [position, reward, final, path]
            //  [y, x]
            [[4, 2], 0, false, "img/rlboard/place/Dynamite.png"],
            [[4, 1], 0, false, "img/rlboard/place/Bomb.png"],
            [[5, 0], 0, false, "img/rlboard/place/Dynamite.png"],
            [[3, 4], 0, false, "img/rlboard/place/Net.png"],
            [[2, 5], 0, false, "img/rlboard/place/Bomb.png"],
            [[1, 3], 0, false, "img/rlboard/place/Dynamite.png"],
            [[5, 5], 0, true, "img/rlboard/place/Treasure.png"],
        ],
        "agentStartPosition": [0, 0],  // [x, y]
        "agentImagePath": [
            "img/rlboard/player/Shark.png",
            // "img/rlboard/player/slime_1.png",
            // "img/rlboard/player/slime_2.png",
            // "img/rlboard/player/slime_3.png",
            // "img/rlboard/player/slime_4.png",
            // "img/rlboard/player/slime_5.png",
            // "img/rlboard/player/slime_6.png",
            // "img/rlboard/player/slime_7.png",
        ]
    },
];
