const frame = document.querySelector('#td_update_calculation');

const input_V = frame.querySelector("#td-V");
const input_gamma = frame.querySelector("#td-gamma");
const input_V_next = frame.querySelector("#td-V-next");
const input_R = frame.querySelector("#td-R");
const input_alpha = frame.querySelector("#td-alpha");
const V_new_calc = frame.querySelector('#td-V-new-calc');


function checkEmptyAndCalculate(id) {
    let input = document.getElementById(id);
    if(input.value === ""){
        input.value = 0;
    }
    calculateTDUpdate();
}

function validateInput(id, invalidCharacters) {
    let input = document.getElementById(id);
    input.value = input.value.replace(invalidCharacters, '');
}

function calculateTDUpdate() {
    let V_st = parseFloat(input_V.value);
    let gamma = parseFloat(input_gamma.value / 100);
    let V_next = parseFloat(input_V_next.value);
    let R = parseFloat(input_R.value);
    let alpha = parseFloat(input_alpha.value);
    
    let V_new = V_st + alpha * (R + gamma * V_next - V_st);
    
    V_new_calc.innerHTML = "\\begin{aligned} V_{new}(s_t)" +
        " &= V(s_t) + \\alpha (R_{t+1} + \\gamma V(s_{t+1}) - V(s_t)) \\\\" +
        " &= " + V_st + " + " + alpha + " \\times (" + R + " + " + gamma.toFixed(2) + " \\times " + V_next + " - " + V_st + ") \\\\" +
        " &= " + V_new.toFixed(2) + " \\end{aligned}";
    
    MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
}


// Add event listeners
input_gamma.addEventListener("keyup", ()  => {
    validateInput(input_gamma.id, /[^0-9.]/g);
});
for (let input of [input_V, input_gamma, input_V_next, input_R, input_alpha]) {
    input.addEventListener("keyup", () => {
        checkEmptyAndCalculate(input.id);
    });
    input.addEventListener("change", () => {
        calculateTDUpdate();
    });
}


calculateTDUpdate();
