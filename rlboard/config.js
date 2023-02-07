export default [
    {
        "backgroundImagePath": "../img/rlboard/background.png",
        "nodes": [
            [[5, 1], -100, true],  // [position, reward, final]
            [[3, 1], -100, true],
            [[3, 4], -100, true],
            [[1, 5], -100, true],
            [[1, 7], -100, true],
            [[3, 7], -100, true],
            [[6, 7], 10000, true],
        ],
        "agentStartPosition": [0, 0],  // [x, y]
        "agentImagePath": "../img/rlboard/player.png"
    },
];
