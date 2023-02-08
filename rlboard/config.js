export default [
    {
        "backgroundImagePath": "../img/rlboard/background.png",
        "nodes": [
            [[5, 1], -1000, true],  // [position, reward, final]
            [[3, 0], -1000, true],
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
            "../img/rlboard/slime_0.png",
            "../img/rlboard/slime_1.png",
            "../img/rlboard/slime_2.png",
            "../img/rlboard/slime_3.png",
            "../img/rlboard/slime_4.png",
            "../img/rlboard/slime_5.png",
            "../img/rlboard/slime_6.png",
            "../img/rlboard/slime_7.png",
        ]
    },
];
