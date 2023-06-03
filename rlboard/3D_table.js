import { game as mcgame } from './play_mcagent.js'
import { game as tdgame } from './play_tdagent.js'
import { game as nsteptdgame } from './play_nstep_tdagent.js'

let mcframe = document.querySelector("#play_mc_3d_table");
let tdframe = document.querySelector("#play_td_3d_table");
let nsteptdframe = document.querySelector("#play_nstep_td_3d_table");


function getData(game) {
    let data = game.agent.value_table.map(v => [...v]);
    let dataNorm = data;

    // transform -> [0, ~]
    // let min = Math.min(...dataNorm.flat());
    // for (let y = 0; y < dataNorm.length; ++y) {
    //     for (let x = 0; x < dataNorm[y].length; ++x) {
    //         dataNorm[y][x] -= min;
    //     }
    // }
    //
    // // normalize -> [0, 1]
    // let max = Math.max(...data.flat());
    // if (max > 0) {
    //     for (let y = 0; y < dataNorm.length; ++y) {
    //         for (let x = 0; x < dataNorm[y].length; ++x) {
    //             dataNorm[y][x] /= max;
    //         }
    //     }
    // }

    let dataTransposed = dataNorm[0].map((x,i) => dataNorm.map(x => x[i]));

    return [{
        z: dataTransposed,
        type: 'surface',
        colorscale: [
            ['0.0', 'rgb(255,200,200)'],
            ['1.0', 'rgb(255,0,0)']
          ],
    }]
}


function getLayout(game) {
    let data = game.agent.value_table.map(v => [...v]);
    let min = Math.min(...data.flat());
    let max = Math.max(...data.flat());
    return {
        title: 'Value Table',
        scene: {
            camera: {
                eye: {x: 1.87, y: 0.88, z: 1.64}
            },
            zaxis: {
                title: "Value",
                range: [min - 1, max + 1],
            }
        },
        autosize: false,
        width: 800,
        height: 400,
        font: {
            size: 15,
        },
        margin: {
            l: 100,
            r: 0,
            b: 0,
            t: 0,
        },
    };
}

Plotly.newPlot(mcframe, getData(mcgame), getLayout(mcgame));
Plotly.newPlot(tdframe, getData(tdgame), getLayout(tdgame));
Plotly.newPlot(nsteptdframe, getData(nsteptdgame), getLayout(nsteptdgame));
setInterval(() => {
    Plotly.react(mcframe, getData(mcgame), getLayout(mcgame));
    Plotly.react(tdframe, getData(tdgame), getLayout(tdgame));
    Plotly.react(nsteptdframe, getData(nsteptdgame), getLayout(nsteptdgame));
}, 5000);
