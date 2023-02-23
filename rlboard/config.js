export default [
    {
        "backgroundImagePath": "../img/rlboard/background.png",
        "nodes": [
            // [position, reward, final, path]  //  [y, x]
            [[5, 1], 10, true, "../img/rlboard/place/place_0.png"],
            [[4, 1], 10, true, "../img/rlboard/place/place_1.png"],
            [[4, 2], 10, true, "../img/rlboard/place/place_2.png"],
            [[3, 4], 10, true, "../img/rlboard/place/place_3.png"],
            [[3, 5], 10, true, "../img/rlboard/place/place_4.png"],
            [[2, 5], 1000, true, "../img/rlboard/place/place_5.png"],
            [[1, 5], 10000, true, "../img/rlboard/place/place_6.png"],
            [[0, 5], 1000, true, "../img/rlboard/place/place_7.png"],
        ],
        "agentStartPosition": [0, 0],  // [x, y]
        "agentImagePath": [
            "../img/rlboard/player/slime_0.png",
            "../img/rlboard/player/slime_1.png",
            "../img/rlboard/player/slime_2.png",
            "../img/rlboard/player/slime_3.png",
            "../img/rlboard/player/slime_4.png",
            "../img/rlboard/player/slime_5.png",
            "../img/rlboard/player/slime_6.png",
            "../img/rlboard/player/slime_7.png",
        ]
    },
];
