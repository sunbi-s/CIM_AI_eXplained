export default [
    {
        "nodes": [
            [[5, 1], 0, false],
            [[3, 1], 0, false],
            [[3, 4], 0, false],
            [[1, 5], 0, false],
            [[1, 7], 0, false],
            [[3, 7], 0, false],
            [[6, 7], 0, true],
        ],
        "graph": [
            [1],
            [2],
            [1,3],
            [2,4,6],
            [3,5],
            [4],
            [3]
        ],
        "agentStartIdx": 1
    },
];
