const frame = document.querySelector('#play_various_gamma');
const div = frame.querySelector('.gamma_board');
const sliderSize = frame.querySelector('.slider_size');
const sliderGamma = frame.querySelector('.slider_gamma');

const sizes = [4, 5, 6];
const gammas = [990, 991, 992, 993, 994, 995, 996, 997, 998, 999, 1000];

function changeImage(i_size, i_gamma) {
    let imagePath = "img/gamma_board/" + sizes[i_size] + "_" + gammas[i_gamma] + ".png";
    div.style.backgroundImage = "url('" + imagePath + "')";
    div.style.backgroundSize = "contain";
    div.style.margin = "auto";
    div.style.width = "960px";
    div.style.height = "520px";
}


let btnTest = frame.querySelector('.btn_test');
let btnStop = frame.querySelector('.btn_stop');

btnTest.addEventListener("click", function() {
    btnTest.style.display = "none";
    btnStop.style.display = "inline-block";
    // TODO: move player along saved trajectories
    console.log("Click on Test button");
    // game.run_test(1).then(() => {
    //     btnTest.style.display = "inline-block";
    //     btnStop.style.display = "none";
    // });
});
btnStop.addEventListener("click", function() {
    btnTest.style.display = "inline-block";
    btnStop.style.display = "none";
    // TODO: stop player
    console.log("Click on Stop button");
    // game.interrupt = true;
    // game.environment.reset();
});


// Documentation:
// 1. put images in img/gamma_board folder.
//    The name of the image should be in the format of "{size}_{gamma}.png"
// 2. Create new two sliders in index.html.
//    The slider should have the following attributes:
//    class="slider_size"
//    class="slider_gamma"
// 3. Add event listener to the sliders in this file.
//    The event listener should call changeImage() function as follows:
//    changeImage(i_size, i_gamma);
// 4. Remove this debugging code:
changeImage(2, 0);
// 5. Implement button event listeners.
//    The player should move along the saved trajectories.
// 6. Modify the text in index.html to describe this content.
