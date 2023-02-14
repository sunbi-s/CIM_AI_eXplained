
let TESTER = document.getElementById('tester');

function getData() {
    var arr = [];
    for(let i =0;i<10;i++){
        arr.push(Array(10).fill(Math.random()));
    }
    return arr;
}

console.log(getData());


Plotly.newPlot( TESTER, [{
  z: getData(),
  type: 'surface'

}]);
