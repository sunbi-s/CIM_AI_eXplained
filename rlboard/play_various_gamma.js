const frame = document.querySelector('#play_various_gamma');
const leftDiv = frame.querySelector('.gamma_board_left');
const rightDiv = frame.querySelector('.gamma_board_right');
const sliderSize = frame.querySelector('.slider_size');
const sliderGamma = frame.querySelector('.slider_gamma');

const sizes = [4, 5, 6];
const gammas = [990, 991, 992, 993, 994, 995, 996, 997, 998, 999, 1000];

function changeImage(i_size, i_gamma) {
    let leftImagePath = "img/gamma_board/org_" + sizes[i_size] + ".png";
    leftDiv.style.backgroundImage = "url('" + leftImagePath + "')";
    leftDiv.style.backgroundSize = "contain";
    leftDiv.style.width = "50%";

    let rightImagePath = "img/gamma_board/org_" + sizes[i_size] + "_" + gammas[i_gamma] + "_val.png";
    rightDiv.style.backgroundImage = "url('" + rightImagePath + "')";
    rightDiv.style.backgroundSize = "contain";
    rightDiv.style.width = "49.67%";
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
changeImage(2, 2);
// 5. Implement button event listeners.
//    The player should move along the saved trajectories.
// 6. Modify the text in index.html to describe this content.
