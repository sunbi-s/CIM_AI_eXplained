export default [
    {
        "backgroundImagePath": "../img/rlboard/background.png",
        "nodes": [
            [[5, 1], -1000, true],  // [position, reward, final]
            [[3, 0], -1000, true],  //  [y, x]
            [[4, 1], -1000, true],
            [[4, 2], -1000, true],
            [[3, 4], -1000, true],
            [[3, 5], -1000, true],
            [[2, 5], 1000, true],
            [[1, 5], 10000, true],
            [[0, 5], 1000, true],
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
