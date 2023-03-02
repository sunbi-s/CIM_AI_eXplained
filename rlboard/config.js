export default [
    {
        "backgroundImagePath": "../img/rlboard/background.png",
        "nodes": [
            // [position, reward, final, path]
            //  [y, x]
            [[6, 4], -10, false, "../img/rlboard/place/place_0.png"],
            [[4, 1], -10, false, "../img/rlboard/place/place_1.png"],
            [[6, 0], -10, false, "../img/rlboard/place/place_2.png"],
            [[3, 4], -20, false, "../img/rlboard/place/place_3.png"],
            [[5, 5], -50, false, "../img/rlboard/place/place_4.png"],
            [[2, 5], -10, false, "../img/rlboard/place/place_5.png"],
            [[1, 6], 200, true, "../img/rlboard/place/place_6.png"],
            // [[1, 6],   0, true, "../img/rlboard/place/place_6.png"],
            [[1, 3], -10, false, "../img/rlboard/place/place_7.png"],
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
