//??ISSUE for cyberduck: localhosts website says "No navigator.mediaDevices.getUserMedia exists." on loading webpage??

// define variables
const videoElement = document.getElementsByClassName("input_video")[0];
const mouthCanvasElement = document.getElementsByClassName("mouth_canvas")[0];
const mouthCanvasCtx = mouthCanvasElement.getContext("2d");
const text_element = document.querySelector(".text");
const story = document.querySelector(".story");
const exterior_element = document.querySelector(".exterior");

const audios = [
    document.querySelector(".dictee"),
    document.querySelector(".ventriloquism_1"),
    document.querySelector(".ventriloquism_2"),
    document.querySelector(".spectacle_1"),
    document.querySelector(".spectacle_2"),
    document.querySelector(".wow"),
    //index = 6
    document.querySelector(".zhou_1"),
    document.querySelector(".zhou_2"),
    //index = 8
    document.querySelector(".pause_1"),
    document.querySelector(".pause_2"),
    document.querySelector(".monolingualism"),
    document.querySelector(".ask_1"),
    document.querySelector(".ask_2"),
    document.querySelector(".ask_3"),
    document.querySelector(".how_1"),
    document.querySelector(".how_2"),
    document.querySelector(".how_3"),
    document.querySelector(".zhou_3"),
    document.querySelector(".zhou_4"),
    document.querySelector(".doves"),
    document.querySelector(".lavender"),
    document.querySelector(".flowers"),
];

document.querySelectorAll("audio").loop = false;
let index = 0;
let audio = audios[index];

const texts = [
    "To speak is to repeat.",
    "TEST",
    "To speak is to release.",
    "TEST",
    "To speak is to relay.",
    "To speak is to be registered.",
    //index = 6
    "TEST",
    "To speak is to relinquish.",
    "To speak is to respire/refrain.",
    "To speak is to resign.",
    "To speak beyond speech. <br> How to say",
    "some",
    "thing.",
    "To speak is to regulate.",
    "To speak is to receive.",
    "To speak is to be relieved from oneself.",
    "To speak is to resolve.",
];

let text = texts[0];

const imgs = [
    "assets/img/coastline.jpg",
    "assets/img/moon.jpg",
    "assets/img/puddle.jpeg",
    "assets/img/sunset.jpeg",
];

let img_index = 0;
let img = imgs[img_index];

let mouth_inner_distances = 0;
let mouth_inner_distances_2;
let pause = 0;

let mouth_outer_distances = 0;

let svg_path = "";
let svg_points = [];
let dv_points = [];
let textWidth;
let textHeight;

function calcDistance(x1, y1, x2, y2) {
    return Math.hypot(x1 - x2, y1 - y2);
}

//this function basically saves mouth_inner_distances as mouth_inner_distances_2, and updates it every 100ms
function updateVariableAfterSecond() {
    mouth_inner_distances_2 = mouth_inner_distances;
    //this calls the function again once it ends, basically looping it every 100ms
    setTimeout(() => {
        updateVariableAfterSecond(mouth_inner_distances);
    }, 10);
}

updateVariableAfterSecond();

//this is checking the change between the mouth_inner_distances now and mouth_inner_distances_2 (or mouth_inner_distances 100ms ago)
//if the change is greater than 5, that means the user is probably speaking!
function checkCurrentAbsRange() {
    let change = mouth_inner_distances - mouth_inner_distances_2;
    if (change > 4) {
        console.log("speaking");
        pause = 0;
        audio.play();
    } else {
        pause++;
        if (pause > 16) {
            audio.pause();
        }
    }
}

//when one audio is finished playing, move to the next one
audio.addEventListener("ended", change_audio);

function change_audio() {
    index++;
    audio = audios[index];
    text = texts[index];

    // console.log("ended");

    audio.addEventListener("ended", change_audio);
}

let landmarks_x_cropped = [];
let landmarks_y_cropped = [];

//FACEMESH STUFF
// Results Handler
function onResults(results) {
    //need this if statement, or else video freezes when it can't find the multiFaceLandmarks (e.g. when user has turned their head away from the camera)
    if (results.multiFaceLandmarks) {
        //needs [0] bc the array of results.multiFaceLandmarks has multiple things inside it, but facemesh points are stored in [0]
        if (results.multiFaceLandmarks[0]) {
            //The facemesh points 212, 64, 432, and 200 are going to be the outer limits of the crop of the webcam view (mouthCanvasElement) that is shown on my website. They are based off of the points found in https://raw.githubusercontent.com/google/mediapipe/master/mediapipe/modules/face_geometry/data/canonical_face_model_uv_visualization.png

            //Facemesh/mediapipe gives the x and y values of its landmarks as percentages of the total webcam view size (where 0 is leftmost, 1 is rightmost), rather than specific numerical coordinates.
            let crop_x_percent = results.multiFaceLandmarks[0][212].x;
            let crop_y_percent = results.multiFaceLandmarks[0][164].y;
            let crop_width_percent =
                results.multiFaceLandmarks[0][432].x - crop_x_percent;
            let crop_height_percent =
                results.multiFaceLandmarks[0][199].y - crop_y_percent;

            //??What exactly is mouthCanvasElement.width??
            // multiply the percentages by the mouthCanvasElement to get their absolute x,y values, rather than just percentages
            let crop_x = crop_x_percent * mouthCanvasElement.width;
            let crop_y = crop_y_percent * mouthCanvasElement.height;
            let crop_width = crop_width_percent * mouthCanvasElement.width;
            let crop_height = crop_height_percent * mouthCanvasElement.height;

            //mouth outer left
            let landmark_61_percent = results.multiFaceLandmarks[0][61].x;
            //mouth outer right
            let landmark_91_percent = results.multiFaceLandmarks[0][91].x;
            let landmark_61_top_percent = results.multiFaceLandmarks[0][61].y;

            let mouth_outer_width_percent =
                landmark_91_percent - landmark_61_percent;

            //mouth outer top
            let landmark_0_percent = results.multiFaceLandmarks[0][0].y;
            //mouth outer bottom
            let landmark_17_percent = results.multiFaceLandmarks[0][17].y;
            //mouth inner top
            let landmark_13_percent = results.multiFaceLandmarks[0][13].y;
            //mouth inner bottom
            let landmark_14_percent = results.multiFaceLandmarks[0][14].y;

            let landmark_17_x =
                results.multiFaceLandmarks[0][17].x * mouthCanvasElement.width;
            let landmark_17_y =
                results.multiFaceLandmarks[0][17].y * mouthCanvasElement.height;
            let landmark_0_x =
                results.multiFaceLandmarks[0][0].x * mouthCanvasElement.width;
            let landmark_0_y =
                results.multiFaceLandmarks[0][0].y * mouthCanvasElement.height;

            let landmark_13_x =
                results.multiFaceLandmarks[0][13].x * mouthCanvasElement.width;
            let landmark_13_y =
                results.multiFaceLandmarks[0][13].y * mouthCanvasElement.height;
            let landmark_14_y =
                results.multiFaceLandmarks[0][14].y * mouthCanvasElement.height;
            let landmark_14_x =
                results.multiFaceLandmarks[0][14].x * mouthCanvasElement.width;

            let mouth_inner_height = landmark_14_y - landmark_13_y;

            mouth_inner_distances = calcDistance(
                landmark_14_x,
                landmark_14_y,
                landmark_13_x,
                landmark_13_y
            );

            mouth_outer_distances = calcDistance(
                landmark_17_x,
                landmark_17_y,
                landmark_0_x,
                landmark_0_y
            );

            checkCurrentAbsRange();

            //subtract bottom y from top y because the bottom y will be a larger positive value (y calculated as positive distance from top of window!)
            let mouth_outer_height_percent =
                landmark_17_percent - landmark_0_percent;
            let mouth_inner_height_percent =
                landmark_14_percent - landmark_13_percent;

            //head top
            let landmark_10_percent = results.multiFaceLandmarks[0][10].y;
            //head bottom
            let landmark_152_percent = results.multiFaceLandmarks[0][152].y;
            let head_height_percent =
                landmark_152_percent - landmark_10_percent;

            let head_mouth_ratio =
                head_height_percent / mouth_outer_height_percent;

            //need to use mouth_outer_height_percent, not mouth_inner_height_percent, because mouth_inner_height_percent returns a negative value sometimes
            let mouth_height_width_ratio =
                mouth_outer_height_percent / mouth_outer_width_percent;

            // let image = document.createElement("img");

            // if (mouth_height_width_ratio > 30) {
            //     text = "O";
            //     text =
            //         "My  monolingualism  dwells,  and  I  call  it  my  dwelling;  it feels like one to me, and I remain in it and inhabit it.";
            // } else if (mouth_height_width_ratio > 15) {
            //     text = "A";
            //     text = "It inhabits me.";
            // } else if (mouth_height_width_ratio > 10 && head_mouth_ratio < 6) {
            //     text = "E";
            //     text =
            //         "The   monolingualism  in  which  I  draw  my  very  breath  is,  for  me,  my  element. ";
            // } else if (head_mouth_ratio > 11) {
            //     text = "M";
            //     text =
            //         "Not  a  natural  element,  not  the  transparency  of  the  ether,  but  an  absolute  habitat.";

            //     //!!Test ONLY!!
            //     // image.src = "assets/mouth.png";
            // } else {
            //     text = "say something";
            //     text = "I am monolingual.";
            // }

            document.querySelector(".text p").innerText = text;
            //                document.querySelector('.letter').appendChild(image);

            mouthCanvasCtx.save();

            clear_canvas();

            //this is the function that is cropping the webcam view and zooming in the view to our chosen coordinates/landmarks
            //drawImage takes these values: drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)

            mouthCanvasCtx.drawImage(
                results.image,
                crop_x,
                crop_y,
                crop_width,
                crop_height,
                0,
                0,
                mouthCanvasElement.width,
                mouthCanvasElement.height
            );

            landmarks_x_cropped = [];
            landmarks_y_cropped = [];

            // booleans
            let b_blur = false,
                b_dots = false,
                b_lines = false,
                b_dots_inverted = false,
                b_dots_quote = false,
                b_textbox = false,
                b_exterior = false,
                b_interior = false,
                b_between = false,
                b_noise = false,
                b_name = false,
                b_named = false,
                b_inner_image = false;

            //.zhou_1
            if (index == 11) {
                b_blur = true;
                blur();
            } else if (index == 2) {
                b_focus = true;
                focus();
            } else if (index == 3) {
                b_dots = true;
                dots();
            } else if (index == 4) {
                b_lines = true;
            } else if (index == 5) {
                b_dots_inverted = true;
                dots_inverted();
            } else if (index == 6) {
                b_dots_quote = true;
            } else if (index == 7) {
                b_textbox = true;
                textbox();
            } else if (index == 8) {
                b_exterior = true;
                exterior();
            } else if (index == 9) {
                b_interior = true;
                interior();
            } else if (index == 10) {
                b_between = true;
                between();
            } else if (index == 1) {
                b_noise = true;
                noise(mouth_outer_distances);
            } else if (index == 12) {
                b_name = true;
                // name();
            } else if (index == 13) {
                b_named = true;
                // named();
            } else if (index == 14) {
                b_inner_image = true;
                inner_image();
            } else if (index == 15) {
            }

            // draw landmarks on face
            for (const landmarks of results.multiFaceLandmarks) {
                landmarks.forEach((landmark, i) => {
                    // if (
                    //     i === 13 ||
                    //     i === 312 ||
                    //     i === 311 ||
                    //     i === 310 ||
                    //     i === 415 ||
                    //     i === 308 ||
                    //     i === 324 ||
                    //     i === 318 ||
                    //     i === 402 ||
                    //     i === 317 ||
                    //     i === 14 ||
                    //     i === 87 ||
                    //     i === 178 ||
                    //     i === 88 ||
                    //     i === 95 ||
                    //     i === 78 ||
                    //     i === 191 ||
                    //     i === 80 ||
                    //     i === 81 ||
                    //     i === 82
                    // ) {
                    // Landmarks
                    // ===============================

                    landmark_x_percent = landmark.x;
                    landmark_y_percent = landmark.y;
                    landmark_x = landmark_x_percent * mouthCanvasElement.width;
                    landmark_y = landmark_y_percent * mouthCanvasElement.height;

                    //this code scales up the landmark positions from their original x,y to the new zoomed-in scale, taken from:
                    //https://stackoverflow.com/questions/20630207/transforming-coordinates-of-one-rectangle-to-another-rectangle
                    landmark_x_cropped =
                        ((landmark_x - crop_x) / crop_width) *
                        mouthCanvasElement.width;
                    landmark_y_cropped =
                        ((landmark_y - crop_y) / crop_height) *
                        mouthCanvasElement.height;

                    //pushes these values to global array
                    landmarks_x_cropped.push(landmark_x_cropped);
                    landmarks_y_cropped.push(landmark_y_cropped);

                    if (b_dots_inverted) {
                    } else {
                        mouthCanvasCtx.fillStyle = "red";
                    }

                    //?? why does this if statement need to be inside landmarks.forEach to work? When I put it outside, with index == 1, it doesn't draw the lines??
                    if (b_dots || b_dots_inverted) {
                        //!this draws the landmark dots!
                        // must map this position to scaled position
                        mouthCanvasCtx.beginPath();
                        mouthCanvasCtx.ellipse(
                            landmark_x_cropped,
                            landmark_y_cropped,
                            3,
                            3,
                            0,
                            0,
                            2 * Math.PI
                        );
                    } else if (b_lines) {
                        lines();
                    }
                    //?? How to cycle through multiple punctuations while still on index ==4??
                    else if (b_dots_quote) {
                        mouthCanvasCtx.font = "50px serif";
                        mouthCanvasCtx.fillText(
                            ",",
                            landmark_x_cropped,
                            landmark_y_cropped
                        );
                    } else if (b_name) {
                        mouthCanvasCtx.font = "40px serif";
                        mouthCanvasCtx.fillText(
                            "to name",
                            landmark_x_cropped,
                            landmark_y_cropped
                        );
                    } else if (b_named) {
                        mouthCanvasCtx.font = "40px serif";
                        mouthCanvasCtx.fillText(
                            "to be named",
                            landmark_x_cropped,
                            landmark_y_cropped
                        );
                    } else {
                    }

                    mouthCanvasCtx.fill();

                    //adds the coordinate of the point next to the dot onscreen
                    // mouthCanvasCtx.fillText(i, landmark_x_cropped, landmark_y_cropped);
                    // mouthCanvasCtx.fillText(
                    //     landmark_x_cropped,
                    //     landmark_x_cropped,
                    //     landmark_y_cropped
                    // );

                    // SVG Path
                    // ===============================
                    //?? Why is it multiplied by 100 here?
                    svg_points[i] = {
                        x:
                            (landmark_x_cropped / mouthCanvasElement.width) *
                            100,
                        y:
                            (landmark_y_cropped / mouthCanvasElement.height) *
                            100,
                    };

                    //?? Why is it multiplied by document.body stuff here?
                    dv_points[i] = {
                        x:
                            (landmark_x_cropped / mouthCanvasElement.width) *
                            document.body.clientWidth,
                        y:
                            (landmark_y_cropped / mouthCanvasElement.height) *
                            document.body.clientHeight,
                    };
                    // }
                });

                //!! This section of code makes the clippath for the text set to the facemesh landmarks!!
                //This uses clippath (css, written polygon-esque) to mask
                polygon_path = "";
                //must input these paths in order (as if drawing the polygon)
                polygon_path += `${svg_points[13].x}% ${svg_points[13].y}%, `;
                polygon_path += `${svg_points[312].x}% ${svg_points[312].y}%, `;
                polygon_path += `${svg_points[311].x}% ${svg_points[311].y}%, `;
                polygon_path += `${svg_points[310].x}% ${svg_points[310].y}%, `;
                polygon_path += `${svg_points[415].x}% ${svg_points[415].y}%, `;
                polygon_path += `${svg_points[308].x}% ${svg_points[308].y}%, `;
                polygon_path += `${svg_points[324].x}% ${svg_points[324].y}%, `;
                polygon_path += `${svg_points[318].x}% ${svg_points[318].y}%, `;
                polygon_path += `${svg_points[402].x}% ${svg_points[402].y}%, `;
                polygon_path += `${svg_points[317].x}% ${svg_points[317].y}%, `;
                polygon_path += `${svg_points[14].x}% ${svg_points[14].y}%, `;
                polygon_path += `${svg_points[87].x}% ${svg_points[87].y}%, `;
                polygon_path += `${svg_points[178].x}% ${svg_points[178].y}%, `;
                polygon_path += `${svg_points[88].x}% ${svg_points[88].y}%, `;
                polygon_path += `${svg_points[95].x}% ${svg_points[95].y}%, `;
                polygon_path += `${svg_points[78].x}% ${svg_points[78].y}%, `;
                polygon_path += `${svg_points[191].x}% ${svg_points[191].y}%, `;
                polygon_path += `${svg_points[80].x}% ${svg_points[80].y}%, `;
                polygon_path += `${svg_points[81].x}% ${svg_points[81].y}%, `;
                polygon_path += `${svg_points[82].x}% ${svg_points[82].y}%, `;
                polygon_path += `${svg_points[13].x}% ${svg_points[13].y}% `;

                let polygon_clipped =
                    document.querySelector(".polygon-clipped");
                if (polygon_clipped) {
                    polygon_clipped.style.clipPath =
                        "polygon(" + polygon_path + ")";
                }

                // this section of code is for inverting the mask, and although it uses the same units as polygon_path it must be rewritten slightly differently since setting coordinates for a polygon needs to be written differently from those of an svg
                // this uses mask (css, written svg-esque) to mask
                svg_path = "";
                // must input these paths in order (as if drawing the polygon)
                svg_path += `${svg_points[13].x},${svg_points[13].y} `;
                svg_path += `${svg_points[312].x},${svg_points[312].y} `;
                svg_path += `${svg_points[311].x},${svg_points[311].y} `;
                svg_path += `${svg_points[310].x},${svg_points[310].y} `;
                svg_path += `${svg_points[415].x},${svg_points[415].y} `;
                svg_path += `${svg_points[308].x},${svg_points[308].y} `;
                svg_path += `${svg_points[324].x},${svg_points[324].y} `;
                svg_path += `${svg_points[318].x},${svg_points[318].y} `;
                svg_path += `${svg_points[402].x},${svg_points[402].y} `;
                svg_path += `${svg_points[317].x},${svg_points[317].y} `;
                svg_path += `${svg_points[14].x},${svg_points[14].y} `;
                svg_path += `${svg_points[87].x},${svg_points[87].y} `;
                svg_path += `${svg_points[178].x},${svg_points[178].y} `;
                svg_path += `${svg_points[88].x},${svg_points[88].y} `;
                svg_path += `${svg_points[95].x},${svg_points[95].y} `;
                svg_path += `${svg_points[78].x},${svg_points[78].y} `;
                svg_path += `${svg_points[191].x},${svg_points[191].y} `;
                svg_path += `${svg_points[80].x},${svg_points[80].y} `;
                svg_path += `${svg_points[81].x},${svg_points[81].y} `;
                svg_path += `${svg_points[82].x},${svg_points[82].y} `;
                svg_path += `${svg_points[13].x},${svg_points[13].y} `;

                let polygon_clipped_inverted = document.querySelector(
                    ".polygon-clipped-inverted"
                );
                if (polygon_clipped_inverted) {
                    //code based off "Update 3 (what I recommend in 2020)" in https://stackoverflow.com/questions/48737295/create-a-reverse-clip-path-css-or-svg
                    polygon_clipped_inverted.style[
                        "-webkit-mask"
                    ] = `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100" preserveAspectRatio="none"><polygon points="${svg_path}" fill="black"/></svg>') 0/100% 100%, linear-gradient(#fff, #fff)`;
                }

                // document
                //     .getElementById("polygon")
                //     .setAttribute("points", svg_path);

                textWidth = dv_points[308].x - dv_points[78].x;
                textHeight = dv_points[14].y - dv_points[13].y;

                //?? trying to stabilize the text
                // const storyBoundingBox = story.getBoundingClientRect();

                // const sx = lerp(
                //     storyBoundingBox.left,
                //     dv_points[13].x - textWidth / 2,
                //     1
                // );
                // const sy = lerp(
                //     storyBoundingBox.top,
                //     dv_points[14].y - textHeight,
                //     1
                // );

                if (b_textbox) {
                } else {
                    // story.style.transform = `translate(${sx}px ,${sy}px)`;

                    story.style.transform = `translate(${round(
                        dv_points[13].x - textWidth / 2
                    )}px ,${round(dv_points[14].y - textHeight)}px)`;

                    story.style.height = `${Math.floor(textHeight)}px`;

                    story.style.width = `${Math.floor(textWidth)}px`;
                }
            }

            mouthCanvasCtx.restore();
        }
    }
}

// Create Facemesh
const faceMesh = new FaceMesh({
    locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
    },
});

// Options
faceMesh.setOptions({
    maxNumFaces: 1,
    refineLandmarks: true,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5,
});

// Event Listener
faceMesh.onResults(onResults);

// Create Camera
const camera = new Camera(videoElement, {
    onFrame: async () => {
        await faceMesh.send({ image: videoElement });
    },
    //These width and height are the dimensions of the original canvas, that then gets stretched to 100vw and 100vh to cover the whole screen in the css stylesheet
    width: 1280,
    height: 720,
});

// Start Cam
camera.start();

// ===============================
//General / reusable functions
// https://gist.github.com/xposedbones/75ebaef3c10060a3ee3b246166caab56
function map(in_val, in_min, in_max, out_min, out_max) {
    return (
        ((in_val - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min
    );
}

const round = (val) => Math.ceil(val / 20) * 20;
function lerp(start, end, amt) {
    return (1 - amt) * start + amt + end;
}

function clear_canvas() {
    mouthCanvasCtx.clearRect(
        0,
        0,
        mouthCanvasElement.width,
        mouthCanvasElement.height
    );
}

//add transition to story so that it doesn't jitter (stabilize position)
(function add_transition() {
    setTimeout(() => {
        story.style.transition = "transform 1s ease-in-out";
    }, 500);
})();

// ===============================
// Specific / storyline functions

function blur() {
    mouthCanvasElement.style.filter = "blur(30px)";
    //enlarge the canvas a little so that the blurred edges don't appear onscreen
    mouthCanvasElement.style.width = "105vw";
    mouthCanvasElement.style.height = "105vh";
    //reposition canvas so things remain centered
    mouthCanvasElement.style.left = "-2.5vw";
    mouthCanvasElement.style.top = "-2.5vh";
}

function focus() {
    mouthCanvasElement.style.filter = "";
    mouthCanvasElement.style.width = "100vw";
    mouthCanvasElement.style.height = "100vh";
    mouthCanvasElement.style.left = "0vw";
    mouthCanvasElement.style.top = "0vh";
    mouthCanvasElement.style.transition =
        "filter .2s, width 1s, height 1s, top 1s, left 1s";
}

function dots() {
    clear_canvas();
    mouthCanvasElement.style.background = "black";

    //??why doesn't this work??
    landmarks_x_cropped.forEach((landmark_x_cropped, i) => {
        mouthCanvasCtx.beginPath();
        mouthCanvasCtx.ellipse(
            landmark_x_cropped,
            landmarks_y_cropped[i],
            3,
            3,
            0,
            0,
            2 * Math.PI
        );
    });

    // console.log("dots");
}

function lines() {
    mouthCanvasCtx.strokeStyle = "red";

    mouthCanvasCtx.beginPath();
    mouthCanvasCtx.moveTo(landmarks_x_cropped[191], landmarks_y_cropped[191]);
    mouthCanvasCtx.lineTo(landmarks_x_cropped[95], landmarks_y_cropped[95]);
    mouthCanvasCtx.stroke();

    mouthCanvasCtx.beginPath();
    mouthCanvasCtx.moveTo(landmarks_x_cropped[80], landmarks_y_cropped[80]);
    mouthCanvasCtx.lineTo(landmarks_x_cropped[88], landmarks_y_cropped[88]);
    mouthCanvasCtx.stroke();

    mouthCanvasCtx.beginPath();
    mouthCanvasCtx.moveTo(landmarks_x_cropped[81], landmarks_y_cropped[81]);
    mouthCanvasCtx.lineTo(landmarks_x_cropped[178], landmarks_y_cropped[178]);
    mouthCanvasCtx.stroke();

    mouthCanvasCtx.beginPath();
    mouthCanvasCtx.moveTo(landmarks_x_cropped[82], landmarks_y_cropped[82]);
    mouthCanvasCtx.lineTo(landmarks_x_cropped[87], landmarks_y_cropped[87]);
    mouthCanvasCtx.stroke();

    mouthCanvasCtx.beginPath();
    mouthCanvasCtx.moveTo(landmarks_x_cropped[13], landmarks_y_cropped[13]);
    mouthCanvasCtx.lineTo(landmarks_x_cropped[14], landmarks_y_cropped[14]);
    mouthCanvasCtx.stroke();

    mouthCanvasCtx.beginPath();
    mouthCanvasCtx.moveTo(landmarks_x_cropped[312], landmarks_y_cropped[312]);
    mouthCanvasCtx.lineTo(landmarks_x_cropped[317], landmarks_y_cropped[317]);
    mouthCanvasCtx.stroke();

    mouthCanvasCtx.beginPath();
    mouthCanvasCtx.moveTo(landmarks_x_cropped[311], landmarks_y_cropped[311]);
    mouthCanvasCtx.lineTo(landmarks_x_cropped[402], landmarks_y_cropped[402]);
    mouthCanvasCtx.stroke();

    mouthCanvasCtx.beginPath();
    mouthCanvasCtx.moveTo(landmarks_x_cropped[310], landmarks_y_cropped[310]);
    mouthCanvasCtx.lineTo(landmarks_x_cropped[318], landmarks_y_cropped[318]);
    mouthCanvasCtx.stroke();

    mouthCanvasCtx.beginPath();
    mouthCanvasCtx.moveTo(landmarks_x_cropped[415], landmarks_y_cropped[415]);
    mouthCanvasCtx.lineTo(landmarks_x_cropped[324], landmarks_y_cropped[324]);
    mouthCanvasCtx.stroke();

    console.log("lines");
}

function dots_inverted() {
    clear_canvas();
    mouthCanvasElement.style.background = "red";
    mouthCanvasCtx.fillStyle = "black";

    console.log("dots_inverted");
}

function textbox() {
    text_element.style.background = "red";
    text_element.classList.remove("polygon-clipped");
    text_element.style.clipPath = "";

    //remove positioning from story since textbox (text_element) is now not a fixed clippath but a moving object; text moves with textbox now instead of story
    story.style.transform = "";
    story.style.height = "";
    story.style.width = "";
    story.style.position = "relative";

    //add positioning to textbox
    text_element.style.transform = `translate(${round(
        dv_points[13].x - textWidth / 2
    )}px ,${round(dv_points[14].y - textHeight)}px)`;

    text_element.style.height = `${round(textHeight)}px`;
    text_element.style.width = `${round(textWidth)}px`;
    text_element.style.minHeight = "2em";

    console.log("textbox");
}

function exterior() {
    exterior_element.style.display = "block";
    exterior_element.classList.add("bg_gradient");

    //make the text_element a clippath again, make text move with story instead again
    text_element.classList.add("polygon-clipped");

    story.style.position = "absolute";

    text_element.style.transform = "";
    text_element.style.width = "100vw";
    text_element.style.height = "100vh";
    text_element.style.minHeight = "";

    console.log("exterior");
}

function interior() {
    exterior_element.style.display = "none";
    text_element.classList.add("bg_gradient");

    console.log("interior");
}

function between() {
    exterior_element.style.display = "block";

    console.log("between");
}

function noise(mouth_outer_distances) {
    let mouth_outer_distances_volume = map(mouth_outer_distances, 0, 120, 0, 1);
    // Math.abs always returns a positive value
    audio.volume = Math.abs(mouth_outer_distances_volume);

    console.log("mouth outer distances is" + mouth_outer_distances);
    console.log("volume is:" + audio.volume);
    //?? is this working? for this segment, trying to get the audio to play even if mouth isn't moving
    pause = 0;
    // console.log("noise");
}

//img_delay slows down the rate at which the .inner_img bg changes
let img_delay = 0;

function inner_image() {
    img_delay += 0.5;
    text_element.classList.add("inner_img");
    document.querySelector(".inner_img").style.backgroundImage =
        "url('" + imgs[img_index] + "')";

    if (img_delay > 1) {
        img_index++;
        img_delay = 0;
    }

    //loop the images
    if (img_index > 3) {
        img_index = 0;
    }
}
