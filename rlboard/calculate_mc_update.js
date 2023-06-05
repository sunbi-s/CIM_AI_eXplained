const frame = document.querySelector('#mc_update_calculation');

let ps = frame.querySelectorAll("p");
let inputs = frame.querySelectorAll("input");

const input_rewards = inputs[0];
const input_gamma = inputs[1];
const input_count = inputs[2];
const input_sum = inputs[3];

// add event listener to input tags
input_rewards.addEventListener("change", function() {
    let text = "";
    let rewards = input_rewards.value.split(",");
    for (let i = 0; i < rewards.length; ++i)
    {
        text += rewards[i] + " x " + input_gamma.value + '<sup>' + i + '</sup> + ';
    }

    if (rewards.length > 0 && rewards[0] !== "")
    {
        ps[0].innerHTML = text.slice(0, text.length - 3);
    } else {
        ps[0].innerHTML = "0";
    }

    console.log(rewards);
});
