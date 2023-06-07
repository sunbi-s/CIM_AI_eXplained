const frame = document.querySelector('#mc_update_calculation');

const input_R = frame.querySelector("#mc-R");
const input_gamma = frame.querySelector("#mc-gamma");
const input_N = frame.querySelector("#mc-N");
const input_S = frame.querySelector("#mc-S");
const G_calc = document.querySelector('#mc-G-calc');
const V_calc = document.querySelector('#mc-V-calc');


function checkEmptyAndCalculate(id) {
    let input = document.getElementById(id);
    if(input.value === ""){
        input.value = 0;
    }
    calculateMCUpdate();
}

function validateInput(id, invalidCharacters) {
    let input = document.getElementById(id);
    input.value = input.value.replace(invalidCharacters, '');
}

function calculateMCUpdate() {
    let R_values = input_R.value.split(",");
    let gamma = input_gamma.value / 100;
    let N = input_N.value;
    let S = input_S.value;

    let G_t = 0;
    let gtCalculation = "";
    for (let i = 0; i < R_values.length; ++i) {
        let current_reward = parseFloat(R_values[i]);
        if (R_values[i] === "")
            continue;

        G_t += current_reward * Math.pow(gamma, i);
        if (i === 0) {
            gtCalculation += current_reward;
        } else if (i <= 3) {
            gtCalculation += " + " + current_reward + " \\times " + gamma.toFixed(2) + "^" + i;
        } else if (i === 4) {
            gtCalculation += "  +  ... ";
        }
    }
    let V_new = (parseFloat(S) + G_t) / (parseFloat(N) + 1);
    G_calc.innerHTML = "\\begin{aligned} G_t &= " + gtCalculation + " \\\\ &= " + G_t.toFixed(2) + " \\end{aligned}";
    V_calc.innerHTML = "\\begin{aligned} V_{new}(s_t)" + " &= (S(s_t) + G_t) / (N(s_t) + 1) \\\\" +
        " &= (" + parseFloat(S).toFixed(2) + " + " + G_t.toFixed(2) + ") / (" + N + " + 1) \\\\" +
        " &= " + V_new.toFixed(2) + " \\end{aligned}";

    MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
}


// Add event listeners
input_R.addEventListener("keyup", ()  => {
    validateInput(input_R.id, /[^0-9,]/g);
});
input_gamma.addEventListener("keyup", ()  => {
    validateInput(input_gamma.id, /[^0-9.]/g);
});
input_N.addEventListener("keyup", ()  => {
    validateInput(input_N.id, /[^0-9]/g);
});
for (let input of [input_R, input_gamma, input_N, input_S]) {
    input.addEventListener("keyup", () => {
        checkEmptyAndCalculate(input.id);
    });
    input.addEventListener("change", () => {
        calculateMCUpdate();
    });
}


calculateMCUpdate();
