//??ISSUE for cyberduck: localhosts website says "No navigator.mediaDevices.getUserMedia exists." on loading webpage??

// define variables
const videoElement = document.getElementsByClassName("input_video")[0];
const mouthCanvasElement = document.getElementsByClassName("mouth_canvas")[0];
const mouthCanvasCtx = mouthCanvasElement.getContext("2d");
const text_element = document.querySelector(".text");
const story = document.querySelector(".story");
const story_double = document.querySelector(".story_double");
const snap = document.querySelector(".snap");
const lavender = document.querySelector(".lavender");
const parenthesis_left = document.querySelector(".parenthesis_left");
const parenthesis_right = document.querySelector(".parenthesis_right");
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
    // index = 14
    //??how do i get the transition between these divisions of one whole audio to be unnoticeable??
    document.querySelector(".noise"),
    // index = 15
    document.querySelector(".zhou_3"),
    document.querySelector(".zhou_4"),
    document.querySelector(".zhou_5"),
    document.querySelector(".zhou_6"),
    document.querySelector(".zhou_7"),
    document.querySelector(".zhou_8"),
    document.querySelector(".zhou_9"),
    document.querySelector(".doves_1"),
    document.querySelector(".doves_2"),
    document.querySelector(".doves_3"),
    document.querySelector(".lavender_1"),
    document.querySelector(".lavender_2"),
    //index = 27
    document.querySelector(".lavender_3"),
    document.querySelector(".flowers_1"),
    document.querySelector(".flowers_2"),
    //index = 30
    document.querySelector(".flowers_3"),
    document.querySelector(".end"),
    document.querySelector(".end"),
];

//find duration of audio so I can set CurrentTime accordingly
let noise_duration = 0;
audios[14].addEventListener("loadedmetadata", function () {
    noise_duration = audios[14].duration;
    console.log("duration:" + noise_duration);
});

document.querySelectorAll("audio").loop = false;
let index = 0;
let audio = audios[index];
const double_quotes_text =
    "<span style='font-size:2em'>&ldquo; &nbsp; &nbsp; &nbsp; &rdquo; &nbsp; &nbsp; &nbsp; &nbsp;</span>";
const double_single_quotes_text =
    "<span style='font-size:2em'>&ldquo; <span style='color:black'> &lsquo;&nbsp; &nbsp; &nbsp; &rsquo; </span> &rdquo; &nbsp; &nbsp; &nbsp; &nbsp;</span>";

const texts = [
    "To speak is to repeat.",
    "To speak is to regurgitate.",
    "To speak is to release.",
    "To speak is to repurpose.",
    "To speak is to relay.",
    "To speak is to be registered.",
    //index = 6
    "To speak is to respond.",
    "To speak is to relinquish.",
    "To speak is to refrain.",
    "To speak is to resume.",
    "To speak is to resign oneself.",
    "",
    "",
    "",
    "To speak beyond speech. <br> How to say",
    //index = 15
    "To speak is to regulate.",
    "To speak is to regulate.",
    "To speak is to regulate.",
    "To speak is to regulate.",
    "To speak is to regulate.",
    "To speak is to regulate.",
    "To speak is to regulate.",
    //index = 22
    "To speak is to receive.",
    "To speak is to receive.",
    "To speak is to receive.",
    // double_quotes_text.repeat(100),
    // double_single_quotes_text.repeat(100),
    "To speak is to be relieved from oneself.",
    "To speak is to be relieved from oneself.",
    //index = 27
    "To speak is to be relieved from oneself.",
    "",
    "",
    //index = 30
    "To speak is to resolve.",
    "",
    "",
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

const descriptions = [
    "sunset",
    "pavement",
    "eyes",
    "moon",
    "shore",
    "flowers",
    "rain",
    "skyline",
    "skin",
    "shadows",
    "clouds",
];
let description_index = 0;
let description = descriptions[description_index];

const all_descriptions =
    "sunset pavement eyes moon shore flowers rain skyline skin shadows clouds";
let mouth_inner_distances = 0;
let mouth_inner_distances_2;
let pause = 0;

let svg_path = "";
let svg_points = [];
let dv_points = [];
let textWidth;
let textHeight;

function calcDistances(x1, y1, x2, y2) {
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
    // console.log("check audio:", audio);
    //if breathing (pause_2) or noise audios are running, then have audios play even if user mouth movement is miniscule (change > 0)
    if ((index == 9 || index == 14 || index >= 31) && change > 0) {
        pause = 0;
        //?? trying to get rid of the console error when it tries to play an old audio!
        //error being: "Uncaught (in promise) DOMException: The play() request was interrupted because the media was removed from the document"
        //ternary statement: if audio exists, audio.play(). if not, do nothing
        audio ? audio.play() : null;

        // console.log(audio);
        // console.log("speaking anyway");
    }
    //CHANGE > 4
    else if (change > 4) {
        pause = 0;

        audio ? audio.play() : null;
        // console.log(audio);

        // console.log("speaking");
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
    if (index >= 32) {
    } else {
        //add audio.remove() or audio.pause(), or else multiple audios start playing like 12 change_audio() in. Could be because of time misalignment btw checkCurrentAbsRange() and change_audio()
        audio.remove();
        index++;
        add_transition();

        audio = audios[index];
        text = texts[index];

        console.log("index:" + index);
        // console.log("change audio:", audio);

        audio.addEventListener("ended", change_audio);
    }
}

let landmarks_x_cropped = [];
let landmarks_y_cropped = [];

//global booleans
let screenshotted = false;
let ended = false;

//FACEMESH STUFF
// Results Handler
function onResults(results) {
    remove_black_screen();
    //need this if statement, or else video freezes when it can't find the multiFaceLandmarks (e.g. when user has turned their head away from the camera)
    if (results.multiFaceLandmarks && !ended) {
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

            let landmark_17_x =
                results.multiFaceLandmarks[0][17].x * mouthCanvasElement.width;
            let landmark_17_y =
                results.multiFaceLandmarks[0][17].y * mouthCanvasElement.height;
            let landmark_0_x =
                results.multiFaceLandmarks[0][0].x * mouthCanvasElement.width;
            let landmark_0_y =
                results.multiFaceLandmarks[0][0].y * mouthCanvasElement.height;

            //will use this mouth_face_ratio later for noise(mouth_face_ratio) — this returns the ratio as a percentage (percentage of face that mouth takes up) rather than absolute values, and therefore mouth_face_ratio (and consequently volume) won't change with the user's distance from the webcam
            let landmark_152_y =
                results.multiFaceLandmarks[0][152].y * mouthCanvasElement.width;
            let landmark_10_y =
                results.multiFaceLandmarks[0][10].y * mouthCanvasElement.width;
            let mouth_face_ratio =
                ((landmark_17_y - landmark_0_y) /
                    (landmark_152_y - landmark_10_y)) *
                100;

            let landmark_13_x =
                results.multiFaceLandmarks[0][13].x * mouthCanvasElement.width;
            let landmark_13_y =
                results.multiFaceLandmarks[0][13].y * mouthCanvasElement.height;
            let landmark_14_y =
                results.multiFaceLandmarks[0][14].y * mouthCanvasElement.height;
            let landmark_14_x =
                results.multiFaceLandmarks[0][14].x * mouthCanvasElement.width;

            mouth_inner_distances = calcDistances(
                landmark_14_x,
                landmark_14_y,
                landmark_13_x,
                landmark_13_y
            );

            checkCurrentAbsRange();

            document.querySelector(".text p").innerHTML = text;

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
            let b_doubled = false,
                b_blur = false,
                b_dots = false,
                b_lines = false,
                b_dots_inverted = false,
                b_dots_parenthesis = false,
                b_textbox = false,
                b_exterior = false,
                b_interior = false,
                b_between = false,
                b_noise = false,
                b_stretch_parentheses = false,
                b_name = false,
                b_named = false,
                b_translation = false,
                b_equivalent = false,
                b_equivocation = false,
                b_negotiation = false,
                b_divination = false,
                b_double_quotes = false,
                b_double_single_quotes = false,
                b_double_textbox_separate = false,
                b_double_textbox_overlap = false,
                // b_inner_image = false,
                b_inner_description = false,
                b_text_wall = false,
                // (b_stretch_image = false,
                b_resolve = false,
                b_big_double_quotes = false,
                b_end = false;

            //!! STORY BEATS!!
            if (index == 3) {
                b_doubled = true;
                doubled();
            } else if (index == 4) {
                b_blur = true;
                blur();
            } else if (index == 5) {
                b_focus = true;
                focus();
            } else if (index == 6) {
                b_dots = true;
                dots();
            } else if (index == 7) {
                b_lines = true;
                console.log("lines");
            } else if (index == 8) {
                b_dots_inverted = true;
                dots_inverted();
            } else if (index == 9) {
                b_dots_parenthesis = true;
                dots_parenthesis();
                console.log("dots_parenthesis");
            } else if (index == 10) {
                b_textbox = true;
                textbox();
            } else if (index == 11) {
                b_exterior = true;
                exterior();
            } else if (index == 12) {
                b_interior = true;
                interior();
            } else if (index == 13) {
                b_between = true;
                between();
            } else if (index == 14) {
                b_noise = true;
                b_stretch_parentheses = true;
                noise(mouth_face_ratio);
                stretch_parentheses();
            } else if (index == 15) {
                remove_parentheses();
            } else if (index == 16) {
                b_name = true;
                to_name();
                // console.log("to name");
            } else if (index == 17) {
                b_named = true;
                named();
                // console.log("to be named");
            } else if (index == 18) {
                b_translation = true;
            } else if (index == 19) {
                b_equivalent = true;
            } else if (index == 20) {
                b_equivocation = true;
            } else if (index == 21) {
                b_negotiation = true;
            } else if (index == 22) {
                b_divination = true;
                console.log("divination");
            } else if (index == 23) {
                b_double_quotes = true;
                console.log("double quotes");
            } else if (index == 24) {
                b_double_single_quotes = true;
                console.log("double + single quotes");
            } else if (index == 25) {
                //EMPTY
            } else if (index == 26) {
                b_double_textbox_separate = true;
                document.querySelector(".story_double p").innerHTML = text;
                double_textbox();
            } else if (index == 27) {
                b_double_textbox_overlap = true;
            } else if (index == 28) {
                // b_inner_image = true;
                // inner_image();
                b_inner_description = true;
                inner_description();
            } else if (index == 29) {
                b_text_wall = true;
                text_wall();
            } else if (index == 30) {
                // b_stretch_image = true;
                // stretch_image();
                b_resolve = true;
                resolve();
            } else if (index == 31) {
                b_big_double_quotes = true;
            } else if (index >= 32) {
                b_big_double_quotes = true;
                b_end = true;
                end();
            }

            // draw landmarks on face
            for (const landmarks of results.multiFaceLandmarks) {
                landmarks.forEach((landmark, i) => {
                    let landmark_x_percent = landmark.x;
                    let landmark_y_percent = landmark.y;
                    let landmark_x =
                        landmark_x_percent * mouthCanvasElement.width;
                    let landmark_y =
                        landmark_y_percent * mouthCanvasElement.height;

                    //this code scales up the landmark positions from their original x,y to the new zoomed-in scale, taken from:
                    //https://stackoverflow.com/questions/20630207/transforming-coordinates-of-one-rectangle-to-another-rectangle
                    let landmark_x_cropped =
                        ((landmark_x - crop_x) / crop_width) *
                        mouthCanvasElement.width;
                    let landmark_y_cropped =
                        ((landmark_y - crop_y) / crop_height) *
                        mouthCanvasElement.height;

                    //pushes these values to global array
                    landmarks_x_cropped.push(landmark_x_cropped);
                    landmarks_y_cropped.push(landmark_y_cropped);

                    mouthCanvasElement.style.background = "black";

                    mouthCanvasCtx.font = "20px Lucida Grande";

                    mouthCanvasCtx.strokeStyle = "white";
                    mouthCanvasCtx.fillStyle = "white";

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
                    else if (b_dots_parenthesis) {
                        mouthCanvasCtx.fillText(
                            "(       )",
                            landmark_x_cropped,
                            landmark_y_cropped
                        );
                    } else if (b_name) {
                        mouthCanvasCtx.fillText(
                            "to name",
                            landmark_x_cropped,
                            landmark_y_cropped
                        );
                    } else if (b_named) {
                        mouthCanvasCtx.fillText(
                            "to name",
                            landmark_x_cropped,
                            landmark_y_cropped
                        );
                        mouthCanvasCtx.font = "26px Lucida Grande";
                        mouthCanvasCtx.fillStyle = "black";
                        mouthCanvasCtx.fillText(
                            "to be named",
                            landmark_x_cropped,
                            landmark_y_cropped
                        );
                    } else if (b_translation) {
                        translation();
                    } else if (b_equivalent) {
                        equivalent();
                    } else if (b_equivocation) {
                        equivocation();
                    } else if (b_negotiation) {
                        negotiation();
                    } else if (b_divination) {
                        divination(b_double_quotes);
                    } else if (b_double_quotes) {
                        double_quotes();
                    } else if (b_double_single_quotes) {
                        double_single_quotes();
                    } else if (b_big_double_quotes) {
                        big_double_quotes();
                    } else {
                    }

                    mouthCanvasCtx.fill();

                    // SVG Path
                    // ===============================
                    //Values multiplied by 100 here corresponding to the width="100" height="100" in the svg below (see the url in polygon_clipped_inverted.style)
                    svg_points[i] = {
                        x:
                            (landmark_x_cropped / mouthCanvasElement.width) *
                            100,
                        y:
                            (landmark_y_cropped / mouthCanvasElement.height) *
                            100,
                    };

                    //Values multiplied by document.body values here to map/stretch them to the full browser window
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

                let polygons_clipped =
                    document.querySelectorAll(".polygon-clipped");
                if (polygons_clipped) {
                    polygons_clipped.forEach((polygon_clipped, i) => {
                        polygon_clipped.style.clipPath =
                            "polygon(" + polygon_path + ")";
                    });
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

                textWidth = dv_points[308].x - dv_points[78].x;
                textHeight = dv_points[14].y - dv_points[13].y;

                story.style.height = `${Math.floor(textHeight)}px`;

                //for when the text is justified, need to make the textbox width slightly smaller so that all the text can be seen
                //40 is based on font-size:40px
                if (b_dots_inverted || b_dots_parenthesis) {
                    story.style.transform = `translate(${
                        round(dv_points[13].x - textWidth / 2) + 10 + 40 * 2
                    }px ,${round(dv_points[14].y - textHeight) - 10}px)`;
                    story.style.width = `${Math.floor(textWidth) - 40 * 4}px`;
                } else {
                    //the + 10 and -10px are just finessing the positioning, since the tracking is slightly off. Though technically not having the 10px offsets is more true to centering the posiiton
                    story.style.transform = `translate(${
                        round(dv_points[13].x - textWidth / 2) + 10
                    }px ,${round(dv_points[14].y - textHeight) - 10}px)`;
                    story.style.width = `${Math.floor(textWidth)}px`;
                }

                if (b_double_textbox_separate) {
                    story_double.style.transform = `translate(${round(
                        dv_points[13].x - textWidth / 1.25
                    )}px ,${round(dv_points[14].y - textHeight / 1.75)}px)`;

                    story_double.style.height = `${Math.floor(textHeight)}px`;

                    story_double.style.width = `${Math.floor(textWidth)}px`;
                } else if (b_double_textbox_overlap) {
                    //to get story_double to overlap perfectly with story, make its transition the same! (or close enough)
                    story_double.style.transition = "transform .1s ease-in-out";

                    setTimeout(() => {
                        story_double.style.transition =
                            "transform .5s ease-in-out";
                    }, 500);

                    story_double.style.transform = `translate(${
                        round(dv_points[13].x - textWidth / 2) + 10
                    }px ,${round(dv_points[14].y - textHeight) - 10}px)`;

                    story_double.style.height = `${Math.floor(textHeight)}px`;

                    story_double.style.width = `${Math.floor(textWidth)}px`;
                } else if (b_stretch_parentheses) {
                    //??something is wrong with the positioning? dpeending on the screen size, positioning is off or ok?
                    //!don't forget the px!!!!
                    parenthesis_left.style.left =
                        landmarks_x_cropped[61] + "px";

                    //don't ask me why it's textHeight / 4 instead of / 2, but this centers the parentheses correctly....
                    parenthesis_left.style.top =
                        landmarks_y_cropped[61] - textHeight / 4 + "px";

                    parenthesis_right.style.left =
                        landmarks_x_cropped[291] + "px";

                    parenthesis_right.style.top =
                        landmarks_y_cropped[291] - textHeight / 4 + "px";

                    parenthesis_left.style.height = `${Math.floor(
                        textHeight
                    )}px`;

                    parenthesis_right.style.height = `${Math.floor(
                        textHeight
                    )}px`;

                    // } else if (b_stretch_image) {
                    //     //lavender/img stretch styling
                    //     lavender.style.transform = `translate(${round(
                    //         dv_points[13].x - textWidth / 2
                    //     )}px ,${round(dv_points[14].y - textHeight)}px)`;

                    //     lavender.style.height = `${Math.floor(textHeight)}px`;

                    //     lavender.style.width = `${Math.floor(textWidth)}px`;
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

function remove_black_screen() {
    document.querySelector(".black_screen").style.display = "none";
}

//add transition to story so that it doesn't jitter (stabilize position)
function add_transition() {
    story.style.transition = "transform 0s ease-in-out";

    setTimeout(() => {
        story.style.transition = "transform .5s ease-in-out";
    }, 500);
}

add_transition();

function clear_canvas() {
    mouthCanvasCtx.clearRect(
        0,
        0,
        mouthCanvasElement.width,
        mouthCanvasElement.height
    );
}

function remove_clippath() {
    text_element.classList.remove("polygon-clipped");
    text_element.style.clipPath = "";
}

//make the text_element a clippath again, make text move with story instead again
function restore_clippath() {
    text_element.classList.add("polygon-clipped");
}

// ===============================
// Specific / storyline functions

function doubled() {
    snap.style.display = "block";

    if (screenshotted) {
    } else {
        //screenshotting from webcam code from https://www.studytonight.com/post/capture-photo-using-webcam-in-javascript
        //??is there a way to make the screenshot slightly enlarged? and then make it live video feed??
        let data = mouthCanvasElement.toDataURL("image/png");
        snap.setAttribute("src", data);
        screenshotted = true;
    }
    console.log("doubled");
}

function blur() {
    mouthCanvasElement.style.filter = "blur(30px)";
    //enlarge the canvas a little so that the blurred edges don't appear onscreen
    mouthCanvasElement.style.width = "105vw";
    mouthCanvasElement.style.height = "105vh";
    //reposition canvas so things remain centered
    mouthCanvasElement.style.left = "-2.5vw";
    mouthCanvasElement.style.top = "-2.5vh";

    console.log("blur");
}

function focus() {
    snap.remove();

    mouthCanvasElement.style.filter = "";
    mouthCanvasElement.style.width = "100vw";
    mouthCanvasElement.style.height = "100vh";
    mouthCanvasElement.style.left = "0vw";
    mouthCanvasElement.style.top = "0vh";
    mouthCanvasElement.style.transition =
        "filter .2s, width 1s, height 1s, top 1s, left 1s";

    console.log("focus");
}

function dots() {
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

    console.log("dots");
}

function lines() {
    mouthCanvasCtx.lineWidth = 8;

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
}

function dots_inverted() {
    clear_canvas();
    //get word spacing to expand horizontally with mouth
    story.style.textAlignLast = "justify";

    console.log("dots_inverted");
}

function dots_parenthesis() {}

function textbox() {
    remove_clippath();
    story.style.textAlignLast = "";

    story.style.background = "white";
    story.style.color = "red";
    story.style.mixBlendMode = "saturation";

    story.style.height = `${round(textHeight)}px`;
    story.style.width = `${round(textWidth)}px`;

    console.log("textbox");
}

function exterior() {
    story.style.background = "";
    story.style.color = "white";
    story.style.mixBlendMode = "";

    exterior_element.style.display = "block";
    exterior_element.classList.add("bg_gradient");

    story.style.background = "transparent";

    restore_clippath();

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

function noise(mouth_face_ratio) {
    exterior_element.style.display = "none";
    text_element.classList.remove("bg_gradient");

    // console.log("mouth_face_ratio is" + mouth_face_ratio);
    // console.log("volume is:" + audio.volume);

    let mouth_face_ratio_volume = map(mouth_face_ratio, 1, 20, 0, 1);
    // Math.abs always returns a positive value
    audio.volume = Math.abs(mouth_face_ratio_volume);

    //advancing text with timestamps rather than index because I want the noise audio to be continuous, so it needs to play over just 1 index change
    if (audio.currentTime >= 11) {
        text = "thing";
    } else if (audio.currentTime >= 7) {
        text = "some";
    }
    // console.log("noise");
}

//this function is for stretching parenthesis, based off of stretch_image()
function stretch_parentheses() {
    // display must be block for image to stretch with div!!
    parenthesis_left.style.display = "block";
    parenthesis_right.style.display = "block";

    // console.log("stretch parentheses");
}

function remove_parentheses() {
    restore_clippath();

    parenthesis_left.style.display = "none";
    parenthesis_right.style.display = "none";
}

function to_name() {
    console.log("name");
}

function named() {
    console.log("named");
}

function translation() {
    mouthCanvasCtx.fillText(
        "translation",
        landmarks_x_cropped[13],
        landmarks_y_cropped[13]
    );
    mouthCanvasCtx.fillText(
        "translation",
        landmarks_x_cropped[312],
        landmarks_y_cropped[312]
    );
    mouthCanvasCtx.fillText(
        "translation",
        landmarks_x_cropped[311],
        landmarks_y_cropped[311]
    );
    mouthCanvasCtx.fillText(
        "translation",
        landmarks_x_cropped[310],
        landmarks_y_cropped[310]
    );
    mouthCanvasCtx.fillText(
        "translation",
        landmarks_x_cropped[415],
        landmarks_y_cropped[415]
    );
    mouthCanvasCtx.fillText(
        "translation",
        landmarks_x_cropped[308],
        landmarks_y_cropped[308]
    );
    mouthCanvasCtx.fillText(
        "translation",
        landmarks_x_cropped[324],
        landmarks_y_cropped[324]
    );
    mouthCanvasCtx.fillText(
        "translation",
        landmarks_x_cropped[318],
        landmarks_y_cropped[318]
    );
    mouthCanvasCtx.fillText(
        "translation",
        landmarks_x_cropped[402],
        landmarks_y_cropped[402]
    );
    mouthCanvasCtx.fillText(
        "translation",
        landmarks_x_cropped[317],
        landmarks_y_cropped[317]
    );
    mouthCanvasCtx.fillText(
        "translation",
        landmarks_x_cropped[14],
        landmarks_y_cropped[14]
    );
    mouthCanvasCtx.fillText(
        "translation",
        landmarks_x_cropped[87],
        landmarks_y_cropped[87]
    );
    mouthCanvasCtx.fillText(
        "translation",
        landmarks_x_cropped[178],
        landmarks_y_cropped[178]
    );
    mouthCanvasCtx.fillText(
        "translation",
        landmarks_x_cropped[88],
        landmarks_y_cropped[88]
    );
    mouthCanvasCtx.fillText(
        "translation",
        landmarks_x_cropped[95],
        landmarks_y_cropped[95]
    );
    mouthCanvasCtx.fillText(
        "translation",
        landmarks_x_cropped[78],
        landmarks_y_cropped[78]
    );
    mouthCanvasCtx.fillText(
        "translation",
        landmarks_x_cropped[191],
        landmarks_y_cropped[191]
    );
    mouthCanvasCtx.fillText(
        "translation",
        landmarks_x_cropped[80],
        landmarks_y_cropped[80]
    );
    mouthCanvasCtx.fillText(
        "translation",
        landmarks_x_cropped[81],
        landmarks_y_cropped[81]
    );
    mouthCanvasCtx.fillText(
        "translation",
        landmarks_x_cropped[82],
        landmarks_y_cropped[82]
    );
}

function equivalent() {
    translation();

    mouthCanvasCtx.fillStyle = "black";

    mouthCanvasCtx.fillText(
        "equivalent",
        landmarks_x_cropped[12],
        landmarks_y_cropped[12]
    );
    mouthCanvasCtx.fillText(
        "equivalent",
        landmarks_x_cropped[268],
        landmarks_y_cropped[268]
    );
    mouthCanvasCtx.fillText(
        "equivalent",
        landmarks_x_cropped[271],
        landmarks_y_cropped[271]
    );
    mouthCanvasCtx.fillText(
        "equivalent",
        landmarks_x_cropped[272],
        landmarks_y_cropped[272]
    );
    mouthCanvasCtx.fillText(
        "equivalent",
        landmarks_x_cropped[407],
        landmarks_y_cropped[407]
    );
    mouthCanvasCtx.fillText(
        "equivalent",
        landmarks_x_cropped[292],
        landmarks_y_cropped[292]
    );
    mouthCanvasCtx.fillText(
        "equivalent",
        landmarks_x_cropped[325],
        landmarks_y_cropped[325]
    );
    mouthCanvasCtx.fillText(
        "equivalent",
        landmarks_x_cropped[319],
        landmarks_y_cropped[319]
    );
    mouthCanvasCtx.fillText(
        "equivalent",
        landmarks_x_cropped[403],
        landmarks_y_cropped[403]
    );
    mouthCanvasCtx.fillText(
        "equivalent",
        landmarks_x_cropped[316],
        landmarks_y_cropped[316]
    );
    mouthCanvasCtx.fillText(
        "equivalent",
        landmarks_x_cropped[15],
        landmarks_y_cropped[15]
    );
    mouthCanvasCtx.fillText(
        "equivalent",
        landmarks_x_cropped[86],
        landmarks_y_cropped[86]
    );
    mouthCanvasCtx.fillText(
        "equivalent",
        landmarks_x_cropped[179],
        landmarks_y_cropped[179]
    );
    mouthCanvasCtx.fillText(
        "equivalent",
        landmarks_x_cropped[89],
        landmarks_y_cropped[89]
    );
    mouthCanvasCtx.fillText(
        "equivalent",
        landmarks_x_cropped[96],
        landmarks_y_cropped[96]
    );
    mouthCanvasCtx.fillText(
        "equivalent",
        landmarks_x_cropped[62],
        landmarks_y_cropped[62]
    );
    mouthCanvasCtx.fillText(
        "equivalent",
        landmarks_x_cropped[183],
        landmarks_y_cropped[183]
    );
    mouthCanvasCtx.fillText(
        "equivalent",
        landmarks_x_cropped[42],
        landmarks_y_cropped[42]
    );
    mouthCanvasCtx.fillText(
        "equivalent",
        landmarks_x_cropped[41],
        landmarks_y_cropped[41]
    );
    mouthCanvasCtx.fillText(
        "equivalent",
        landmarks_x_cropped[38],
        landmarks_y_cropped[38]
    );
}

function equivocation() {
    equivalent();

    mouthCanvasCtx.fillStyle = "white";

    mouthCanvasCtx.fillText(
        "equivocation",
        landmarks_x_cropped[11],
        landmarks_y_cropped[11]
    );
    mouthCanvasCtx.fillText(
        "equivocation",
        landmarks_x_cropped[302],
        landmarks_y_cropped[302]
    );
    mouthCanvasCtx.fillText(
        "equivocation",
        landmarks_x_cropped[303],
        landmarks_y_cropped[303]
    );
    mouthCanvasCtx.fillText(
        "equivocation",
        landmarks_x_cropped[304],
        landmarks_y_cropped[304]
    );
    mouthCanvasCtx.fillText(
        "equivocation",
        landmarks_x_cropped[408],
        landmarks_y_cropped[408]
    );
    mouthCanvasCtx.fillText(
        "equivocation",
        landmarks_x_cropped[306],
        landmarks_y_cropped[306]
    );
    mouthCanvasCtx.fillText(
        "equivocation",
        landmarks_x_cropped[307],
        landmarks_y_cropped[307]
    );
    mouthCanvasCtx.fillText(
        "equivocation",
        landmarks_x_cropped[320],
        landmarks_y_cropped[320]
    );
    mouthCanvasCtx.fillText(
        "equivocation",
        landmarks_x_cropped[404],
        landmarks_y_cropped[404]
    );
    mouthCanvasCtx.fillText(
        "equivocation",
        landmarks_x_cropped[315],
        landmarks_y_cropped[315]
    );
    mouthCanvasCtx.fillText(
        "equivocation",
        landmarks_x_cropped[16],
        landmarks_y_cropped[16]
    );
    mouthCanvasCtx.fillText(
        "equivocation",
        landmarks_x_cropped[85],
        landmarks_y_cropped[85]
    );
    mouthCanvasCtx.fillText(
        "equivocation",
        landmarks_x_cropped[180],
        landmarks_y_cropped[180]
    );
    mouthCanvasCtx.fillText(
        "equivocation",
        landmarks_x_cropped[90],
        landmarks_y_cropped[90]
    );
    mouthCanvasCtx.fillText(
        "equivocation",
        landmarks_x_cropped[77],
        landmarks_y_cropped[77]
    );
    mouthCanvasCtx.fillText(
        "equivocation",
        landmarks_x_cropped[76],
        landmarks_y_cropped[76]
    );
    mouthCanvasCtx.fillText(
        "equivocation",
        landmarks_x_cropped[184],
        landmarks_y_cropped[184]
    );
    mouthCanvasCtx.fillText(
        "equivocation",
        landmarks_x_cropped[74],
        landmarks_y_cropped[74]
    );
    mouthCanvasCtx.fillText(
        "equivocation",
        landmarks_x_cropped[73],
        landmarks_y_cropped[73]
    );
    mouthCanvasCtx.fillText(
        "equivocation",
        landmarks_x_cropped[72],
        landmarks_y_cropped[72]
    );
}

function negotiation() {
    equivocation();

    mouthCanvasCtx.fillStyle = "black";

    mouthCanvasCtx.fillText(
        "negotiation",
        landmarks_x_cropped[0],
        landmarks_y_cropped[0]
    );
    mouthCanvasCtx.fillText(
        "negotiation",
        landmarks_x_cropped[267],
        landmarks_y_cropped[267]
    );
    mouthCanvasCtx.fillText(
        "negotiation",
        landmarks_x_cropped[269],
        landmarks_y_cropped[269]
    );
    mouthCanvasCtx.fillText(
        "negotiation",
        landmarks_x_cropped[270],
        landmarks_y_cropped[270]
    );
    mouthCanvasCtx.fillText(
        "negotiation",
        landmarks_x_cropped[409],
        landmarks_y_cropped[409]
    );
    mouthCanvasCtx.fillText(
        "negotiation",
        landmarks_x_cropped[291],
        landmarks_y_cropped[291]
    );
    mouthCanvasCtx.fillText(
        "negotiation",
        landmarks_x_cropped[375],
        landmarks_y_cropped[375]
    );
    mouthCanvasCtx.fillText(
        "negotiation",
        landmarks_x_cropped[321],
        landmarks_y_cropped[321]
    );
    mouthCanvasCtx.fillText(
        "negotiation",
        landmarks_x_cropped[405],
        landmarks_y_cropped[405]
    );
    mouthCanvasCtx.fillText(
        "negotiation",
        landmarks_x_cropped[314],
        landmarks_y_cropped[314]
    );
    mouthCanvasCtx.fillText(
        "negotiation",
        landmarks_x_cropped[17],
        landmarks_y_cropped[17]
    );
    mouthCanvasCtx.fillText(
        "negotiation",
        landmarks_x_cropped[84],
        landmarks_y_cropped[84]
    );
    mouthCanvasCtx.fillText(
        "negotiation",
        landmarks_x_cropped[181],
        landmarks_y_cropped[181]
    );
    mouthCanvasCtx.fillText(
        "negotiation",
        landmarks_x_cropped[91],
        landmarks_y_cropped[91]
    );
    mouthCanvasCtx.fillText(
        "negotiation",
        landmarks_x_cropped[146],
        landmarks_y_cropped[146]
    );
    mouthCanvasCtx.fillText(
        "negotiation",
        landmarks_x_cropped[61],
        landmarks_y_cropped[61]
    );
    mouthCanvasCtx.fillText(
        "negotiation",
        landmarks_x_cropped[185],
        landmarks_y_cropped[185]
    );
    mouthCanvasCtx.fillText(
        "negotiation",
        landmarks_x_cropped[40],
        landmarks_y_cropped[40]
    );
    mouthCanvasCtx.fillText(
        "negotiation",
        landmarks_x_cropped[39],
        landmarks_y_cropped[39]
    );
    mouthCanvasCtx.fillText(
        "negotiation",
        landmarks_x_cropped[37],
        landmarks_y_cropped[37]
    );
}

function divination() {
    landmarks_x_cropped.forEach((landmark_x_cropped, i) => {
        if (
            i == 13 ||
            i == 312 ||
            i == 311 ||
            i == 310 ||
            i == 415 ||
            i == 308 ||
            i == 324 ||
            i == 318 ||
            i == 402 ||
            i == 317 ||
            i == 14 ||
            i == 87 ||
            i == 178 ||
            i == 88 ||
            i == 95 ||
            i == 78 ||
            i == 191 ||
            i == 80 ||
            i == 81 ||
            i == 82 ||
            i == 12 ||
            i == 268 ||
            i == 271 ||
            i == 272 ||
            i == 407 ||
            i == 292 ||
            i == 325 ||
            i == 319 ||
            i == 403 ||
            i == 316 ||
            i == 15 ||
            i == 86 ||
            i == 179 ||
            i == 89 ||
            i == 96 ||
            i == 62 ||
            i == 183 ||
            i == 42 ||
            i == 41 ||
            i == 38 ||
            i == 11 ||
            i == 302 ||
            i == 303 ||
            i == 304 ||
            i == 408 ||
            i == 306 ||
            i == 307 ||
            i == 320 ||
            i == 404 ||
            i == 315 ||
            i == 16 ||
            i == 85 ||
            i == 180 ||
            i == 90 ||
            i == 77 ||
            i == 76 ||
            i == 184 ||
            i == 74 ||
            i == 73 ||
            i == 72
        ) {
        } else {
            mouthCanvasCtx.fillText(
                "divination",
                landmark_x_cropped,
                landmarks_y_cropped[i]
            );
        }
    });
}

function double_quotes() {
    mouthCanvasCtx.font = "180px Lucida Grande";
    mouthCanvasCtx.textBaseline = "top";
    mouthCanvasCtx.fillText(
        "“",
        landmarks_x_cropped[57],
        landmarks_y_cropped[57]
    );
    mouthCanvasCtx.fillText(
        "”",
        landmarks_x_cropped[287],
        landmarks_y_cropped[287]
    );
}

function double_single_quotes() {
    double_quotes();
    mouthCanvasCtx.fillStyle = "black";

    //?? is there a way to get these to align better with the double quotes in double_quotes(?)
    mouthCanvasCtx.fillText(
        "‘",
        landmarks_x_cropped[61],
        landmarks_y_cropped[61]
    );
    mouthCanvasCtx.fillText(
        "’",
        landmarks_x_cropped[291],
        landmarks_y_cropped[291]
    );
}

function double_textbox() {
    story_double.style.display = "grid";
    remove_clippath();

    // story.style.border = "3px solid red";

    console.log("double textbox");
}

let description_delay = 0;

//this is for looping text
function inner_description() {
    restore_clippath();

    //get rid of the double textbox and border around story
    story_double.style.display = "none";
    // story.style.border = "";

    description_delay += 0.3;
    text_element.style.fontSize = "4em";
    //for whatever reason when fontSize > 2em, the whole textbox gets really tall so everything shifts down, so I counter it by adding bottom margin to the p
    document.querySelector(".story p").style.marginBottom = "2em";
    text = descriptions[description_index];

    if (description_delay > 1) {
        description_index++;
        description_delay = 0;
    }

    //loop the descriptions
    if (description_index >= descriptions.length) {
        description_index = 0;
    }
}

//this is for looping images
// //img_delay slows down the rate at which the .inner_img bg changes
// let img_delay = 0;

// function inner_image() {
//     restore_clippath();

//     //get rid of the double textbox and border around story
//     story_double.style.display = "none";
//     // story.style.border = "";

//     img_delay += 0.5;
//     text_element.classList.add("inner_img");
//     document.querySelector(".inner_img").style.backgroundImage =
//         "url('" + imgs[img_index] + "')";

//     if (img_delay > 1) {
//         img_index++;
//         img_delay = 0;
//     }

//     //loop the images
//     if (img_index > 3) {
//         img_index = 0;
//     }
// }

function text_wall() {
    text_element.style.fontSize = "1.5em";
    text_element.style.lineHeight = ".5em";
    text = all_descriptions.repeat(10);
}

//this function is for stretching images
// function stretch_image() {
//     //optional
//     remove_clippath();
//     text_element.classList.remove("inner_img");
//     //optional
//     text_element.classList.add("lavenders_text");
//     text_element.style.backgroundImage = "";

//     //optional
//     text_element.style.backgroundImage = "url(assets/img/lavenders_4.png)";

//     // display must be block for image to stretch with div!!
//     lavender.style.display = "block";

//     //optional
//
//     exterior_element.style.display = "block";
//     exterior_element.classList.add("lavenders");

//     console.log("stretch image");
// }

function resolve() {
    remove_clippath();

    text_element.style.fontSize = "2em";
    text_element.style.lineHeight = "1em";
    document.querySelector(".story p").style.marginBottom = "1em";
    text_element.classList.add("fadeIn");
}

function big_double_quotes() {
    clear_canvas();
    // lavender.style.display = "none";

    mouthCanvasCtx.font = "60px Lucida Grande";

    mouthCanvasCtx.fillText(
        "“",
        landmarks_x_cropped[61],
        landmarks_y_cropped[61]
    );
    mouthCanvasCtx.fillText(
        "”",
        landmarks_x_cropped[291],
        landmarks_y_cropped[291]
    );
}

function end() {
    ended = true;
    //call the quotes one last time so they stay on screen as a freeze frame once onResults stops running when  "if (results.multiFaceLandmarks && !ended)" is no longer true because ended = true now
    big_double_quotes();
}
