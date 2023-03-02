// import { game } from './play_tdagent.js'
import { game } from './play_mcagent.js'

let frame = document.querySelector("#play_3d_table");


function getData() {
    let data = game.agent.value_table;
    let dataNorm = data;

    // transform -> [0, ~]
    let min = Math.min(...dataNorm.flat());
    for (let y = 0; y < dataNorm.length; ++y) {
        for (let x = 0; x < dataNorm[y].length; ++x) {
            dataNorm[y][x] -= min;
        }
    }

    // normalize -> [0, 1]
    let max = Math.max(...data.flat());
    if (max > 0) {
        for (let y = 0; y < dataNorm.length; ++y) {
            for (let x = 0; x < dataNorm[y].length; ++x) {
                dataNorm[y][x] /= max;
            }
        }
    }

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


let layout = {
    title: 'Value Table',
    scene: {
        camera: {
            eye: {x: 1.87, y: 0.88, z: 1.64}
        },
        zaxis: {
            title: "Value",
            range: [0, 2],
        }
    },
    autosize: true,
    width: 1000,
    height: 800,
    font: {
        size: 15,
    },
    margin: {
      l: 40,
      r: 0,
      b: 20,
      t: 0,
    },
};

Plotly.newPlot(frame, getData(), layout);
setInterval(() => {
    Plotly.react(frame, getData(), layout);
}, 5000);
