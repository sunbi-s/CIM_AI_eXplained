
let TESTER = document.getElementById('tester');

function getData() {
    var arr = [];
    for(let i =0;i<10;i++){
        arr.push(Array(10).fill(Math.random()));
    }
    return arr;
}

console.log(getData());


var layout = {
    title: 'test value',
    scene: {camera: {eye: {x: 1.87, y: 0.88, z: 1.64}}},
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
    scene:{
        zaxis:{
            title: "Value"
        }
    }
  };


var data = [{
    z: getData(),
    type: 'surface'
      
  }]

Plotly.newPlot( TESTER, data, layout);
