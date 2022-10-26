//??ISSUE for cyberduck: localhosts website says "No navigator.mediaDevices.getUserMedia exists." on loading webpage??

//??Is there a way to calculate point coordinates relative to a fixed bounding box (like the window bounding box) instead of other facemesh coordinates, which move when the mouth moves?? 

// define variables
const videoElement = document.getElementsByClassName('input_video')[0];
const mouthCanvasElement = document.getElementsByClassName('mouth_canvas')[0];
const mouthCanvasCtx = mouthCanvasElement.getContext('2d');

// Results Handler
function onResults(results) {

    //need this if statement, or else video freezes when it can't find the multiFaceLandmarks (e.g. when user has turned their head away from the camera)
    if (results.multiFaceLandmarks) {
        //needs [0] bc the array of results.multiFaceLandmarks has multiple things inside it, but facemesh points are stored in [0]
        if (results.multiFaceLandmarks[0]){
            
            
            //The facemesh points 212, 64, 432, and 200 are going to be the outer limits of the crop of the webcam view that is shown on the website. They are based off of the points found in https://raw.githubusercontent.com/google/mediapipe/master/mediapipe/modules/face_geometry/data/canonical_face_model_uv_visualization.png
            
            //percentages are calculated based off of entire webcam view size (0 is leftmost, 1 is rightmost); width is percentage of total of what webcam can see
            var crop_x_percent = results.multiFaceLandmarks[0][212].x;
            var crop_y_percent = results.multiFaceLandmarks[0][164].y;
            var crop_width_percent = results.multiFaceLandmarks[0][432].x - crop_x_percent;
            var crop_height_percent = results.multiFaceLandmarks[0][200].y - crop_y_percent;
            
            //??What exactly is mouthCanvasElement.width??
            var crop_x = crop_x_percent * mouthCanvasElement.width;
            var crop_y = crop_y_percent * mouthCanvasElement.height;
            var crop_width = crop_width_percent * mouthCanvasElement.width;
            var crop_height = crop_height_percent * mouthCanvasElement.height;
            
            var mouth_outer_left_percent = results.multiFaceLandmarks[0][61].x;
            var mouth_outer_right_percent = results.multiFaceLandmarks[0][91].x;
            var mouth_outer_left_top_percent = results.multiFaceLandmarks[0][61].y;
            
            var mouth_outer_width_percent = mouth_outer_right_percent - mouth_outer_left_percent;
            
            var mouth_outer_top_percent = results.multiFaceLandmarks[0][0].y;
            var mouth_outer_bottom_percent = results.multiFaceLandmarks[0][17].y;
            var mouth_inner_top_percent = results.multiFaceLandmarks[0][13].y;
            var mouth_inner_bottom_percent = results.multiFaceLandmarks[0][14].y;
            
            var mouth_inner_top_x = results.multiFaceLandmarks[0][13].x * mouthCanvasElement.width;
            var mouth_inner_top_y = results.multiFaceLandmarks[0][13].y * mouthCanvasElement.height;
            
            
            
            //subtract bottom y from top y because the bottom y will be a larger positive value (y calculated as positive distance from top of window!)
            var mouth_outer_height_percent = mouth_outer_bottom_percent - mouth_outer_top_percent;
            var mouth_inner_height_percent = mouth_inner_bottom_percent - mouth_inner_top_percent;
            
            var head_top_percent = results.multiFaceLandmarks[0][10].y;
            var head_bottom_percent = results.multiFaceLandmarks[0][152].y;
            var head_height_percent = head_bottom_percent - head_top_percent;
            
            var head_mouth_ratio = head_height_percent / mouth_outer_height_percent;
            
            
            //??This E value isn't working / changing with mouth??
            //value for "E" sound bc mouth corners rise
            var mouth_corner_ratio = mouth_outer_left_top_percent / mouth_outer_top_percent;
            
            //need to use mouth_outer_height_percent, not mouth_inner_height_percent, because mouth_inner_height_percent returns a negative value sometimes
            var mouth_height_width_ratio = mouth_outer_height_percent / mouth_outer_width_percent;
            
            console.log("mouth_height_width_ratio is" + mouth_height_width_ratio);
//            console.log(mouth_corner_ratio);
            console.log(head_mouth_ratio);
            
            
            var text;
            var image = document.createElement("img");
    
            if (mouth_height_width_ratio > 30) {
                text = "O";
            }
            else if (mouth_height_width_ratio > 15) {
                text = "A";
            }
            else if (mouth_height_width_ratio > 10 && head_mouth_ratio < 6) {
                text = "E";
            }
            else if (head_mouth_ratio > 11) {
                text = "M";
                //!!Test ONLY!!
                image.src = "assets/mouth.png";
            }
            else {
                text = "say something";
            }

            document.querySelector('.letter').innerText = text;
                document.querySelector('.letter').appendChild(image);
            
            mouthCanvasCtx.save();
            mouthCanvasCtx.clearRect(0, 0, mouthCanvasElement.width, mouthCanvasElement.height);
            
            //drawImage takes these values: drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
            mouthCanvasCtx.drawImage(
                results.image, 
                crop_x, crop_y, 
                crop_width, crop_height,
                0, 0,
                mouthCanvasElement.width, mouthCanvasElement.height);
            
             //??trying to get landmarks drawn on face but this needs to be rescaled to new position on screen
            mouthCanvasCtx.fillStyle = 'cyan';
            //must map this position to scaled position
            mouthCanvasCtx.beginPath();
            mouthCanvasCtx.ellipse(mouth_inner_top_x, mouth_inner_top_y, 3,3, 0, 0, 2*Math.PI)
            mouthCanvasCtx.fill();
            
            //??trying to get landmarks drawn on face but this code isn't working??
//            for (const landmarks of results.multiFaceLandmarks) {
//              drawConnectors(mouthCanvasCtx, landmarks, FACEMESH_TESSELATION,
//                             {color: '#C0C0C070', lineWidth: 1});
//              drawConnectors(mouthCanvasCtx, landmarks, FACEMESH_RIGHT_EYE, {color: '#FF3030'});
//              drawConnectors(mouthCanvasCtx, landmarks, FACEMESH_RIGHT_EYEBROW, {color: '#FF3030'});
//              drawConnectors(mouthCanvasCtx, landmarks, FACEMESH_RIGHT_IRIS, {color: '#FF3030'});
//              drawConnectors(mouthCanvasCtx, landmarks, FACEMESH_LEFT_EYE, {color: '#30FF30'});
//              drawConnectors(mouthCanvasCtx, landmarks, FACEMESH_LEFT_EYEBROW, {color: '#30FF30'});
//              drawConnectors(mouthCanvasCtx, landmarks, FACEMESH_LEFT_IRIS, {color: '#30FF30'});
//              drawConnectors(mouthCanvasCtx, landmarks, FACEMESH_FACE_OVAL, {color: '#E0E0E0'});
//              drawConnectors(mouthCanvasCtx, landmarks, FACEMESH_LIPS, {color: '#E0E0E0'});
//            }
            mouthCanvasCtx.restore();
            
        }
    }
}

// Create Facemesh
const faceMesh = new FaceMesh({locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
}});

// Options
faceMesh.setOptions({
    maxNumFaces: 1,
    refineLandmarks: true,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
});

// Event Listener
faceMesh.onResults(onResults);

// Create Camera
const camera = new Camera(videoElement, {
    onFrame: async () => {
        await faceMesh.send({image: videoElement});
    },
    //These width and height are the dimensions of the original canvas, that then gets stretched to 100vw and 100vh to cover the whole screen in the css stylesheet
    width: 1280,
    height: 720
});

// Start Cam
camera.start();