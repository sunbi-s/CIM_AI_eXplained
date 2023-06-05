const frame = document.querySelector('#td_update_calculation');

let ps = frame.querySelectorAll("p");
let inputs = frame.querySelectorAll("input");

const input_v = inputs[0];
const input_gamma = inputs[1];
const input_v_next = inputs[2];
const input_return = inputs[3];
const input_alpha = inputs[4];

// add event listener to input tags
input_v.addEventListener("change", function() {
    ps[6].innerText = input_v.value;
    ps[16].innerText = input_v.value;
});
input_gamma.addEventListener("change", function() {
    ps[12].innerText = input_gamma.value;
});
input_v_next.addEventListener("change", function() {
    ps[14].innerText = input_v_next.value;
});
input_return.addEventListener("change", function() {
    ps[10].innerText = input_return.value;
});
input_alpha.addEventListener("change", function() {
    ps[8].innerText = input_alpha.value;
});

for (let input of inputs)
{
    input.addEventListener("change", function() {
        let v = parseFloat(input_v.value);
        let gamma = parseFloat(input_gamma.value);
        let next_v = parseFloat(input_v_next.value);
        let reward = parseFloat(input_return.value);
        let step_size = parseFloat(input_alpha.value);
        let td_error = parseFloat(reward + gamma * next_v - v);
        let v_new = v + step_size * td_error;
        ps[19].innerText = v_new.toFixed(2);
    });
}
