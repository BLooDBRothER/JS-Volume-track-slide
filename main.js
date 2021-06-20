const btn = document.getElementById("play-btn");
const audio = document.querySelector("audio");
const body = document.querySelector("body");
const time = document.querySelector(".dur-time");
const volIc = document.querySelector(".volume-ic");
const hint = document.getElementById("hint");
const hintic = document.querySelector(".hint-ic")

let screenWidth, screenHeight, midSize, startX, startY, setMode, volumeValue=100;
let ismove = false;
const prevAudio = [];

function setScreenSize(){
    screenWidth = window.screen.availWidth;
    screenHeight = window.screen.availHeight;
    midSize = Math.floor(screenHeight / 2);
}

function volumeChange(value){
    if((value == 0 && volumeValue <= 0) || (value == 1 && volumeValue >= 100)){
        volIc.src = value ? volIc.src : "./Assets/volume-mute.svg";
        return;
    } 
    console.log(volumeValue);
    value ? (audio.volume = (++volumeValue) / 100) : (audio.volume = (--volumeValue) / 100);
    document.documentElement.style.setProperty(`--sound`, `${volumeValue}%`);
    if(volumeValue < 50){
        volIc.src = "./Assets/volume-down.svg";
    }
    else{
        volIc.src = "./Assets/volume.svg";
    }
}

function resetProgress(){
    document.documentElement.style.setProperty(`--fill`, "0%");
    document.documentElement.style.setProperty(`--fill2`, "0%");
    document.documentElement.style.setProperty(`--rev`, "0%");
    btn.classList.remove("play");
    btn.src = "./Assets/play.svg";
    time.innerText = "";
}

function updateProgress(percentage){
    let fill = `${percentage}%`;
    document.documentElement.style.setProperty(`--fill`, fill);
    if(percentage == 100){
        resetProgress();
    }
}

function trackChange(value){
    audio.currentTime = value ? (audio.currentTime+1) : (audio.currentTime-1);
}

body.addEventListener("touchstart", (e) =>{
    startY = e.touches[0].clientY;
    startX = e.touches[0].clientX;
    if(e.touches[0].clientY > midSize){
        setMode = "Volume";
    }
    else{
         setMode = "track";
    }
})

body.addEventListener("touchmove", (e)=>{
    if(setMode == "Volume" && e.touches[0].clientY < startY && (e.touches[0].clientX > (startX-10) && e.touches[0].clientX < (startX+10))){
        startY = e.touches[0].clientY;
        volumeChange(1);
    }
    else if(setMode == "Volume" && e.touches[0].clientY > startY && (e.touches[0].clientX > (startX-10) && e.touches[0].clientX < (startX+10))){
        startY = e.touches[0].clientY;
        volumeChange(0);
    }
    if(setMode == "track" && e.touches[0].clientX < startX && (e.touches[0].clientY > (startY-10) && e.touches[0].clientY < (startY+10))){
        startX = e.touches[0].clientX;
        trackChange(0); 
    }
    else if(setMode == "track" && e.touches[0].clientX > startX && (e.touches[0].clientY > (startY-10) && e.touches[0].clientY < (startY+10))){
        startX = e.touches[0].clientX;
        trackChange(1);
    }
});

body.addEventListener("mousedown", (e) => {
    startY = e.clientY;
    startX = e.clientX;
    if(e.clientY > midSize){
        setMode = "Volume";
    }
    else{
         setMode = "track";
    }
    ismove = true
});

body.addEventListener("mousemove", (e) => {
    if(ismove){
        if(setMode == "Volume" && e.clientY < startY && (e.clientX > (startX-20) && e.clientX < (startX+20))){
            startY = e.clientY;
            volumeChange(1);
        }
        else if(setMode == "Volume" && e.clientY > startY && (e.clientX > (startX-20) && e.clientX < (startX+20))){
            startY = e.clientY;
            volumeChange(0);
        }
        if(setMode == "track" && e.clientX < startX && (e.clientY > (startY-20) && e.clientY < (startY+20))){
            startX = e.clientX;
            trackChange(0); 
        }
        else if(setMode == "track" && e.clientX > startX && (e.clientY > (startY-20) && e.clientY < (startY+20))){
            startX = e.clientX;
            trackChange(1);
        }
    }
});

body.addEventListener("mouseup", (e) => {
    ismove = false;
});

btn.addEventListener("click", () =>{
    console.log(audio.duration);
    if(btn.classList.contains("play")){
        btn.classList.remove("play");
        btn.src = "./Assets/play.svg"
        audio.pause();
    }
    else{
        btn.classList.add("play");
        btn.src = "./Assets/pause.svg"
        audio.play();
    }
});

volIc.addEventListener("click", () => {
    if(audio.volume == 0){
        audio.volume = prevAudio[0];
        volIc.src = prevAudio[1];
        document.documentElement.style.setProperty(`--sound`, `${prevAudio[2]}%`);
    }
    else{
        prevAudio[0] = audio.volume;
        prevAudio[1] = volIc.src;
        prevAudio[2] = volumeValue;
        audio.volume = 0;
        volIc.src = "./Assets/volume-mute.svg";
        document.documentElement.style.setProperty(`--sound`, `0%`);
    }
});

hintic.addEventListener("click", () => {
    if(hint.classList.contains("hint-on")){
        hint.classList.remove("hint-on");
        hint.classList.add("hint-off");
        hintic.src = "./Assets/question.svg";
    }
    else{
        hint.classList.add("hint-on");
        hint.classList.remove("hint-off");
        hintic.src = "./Assets/close.svg";
    }
});

audio.ontimeupdate = () =>{
    time.innerText = `${Math.floor(audio.currentTime/60)} : ${Math.floor(audio.currentTime%60)}`;
    let percentage = (audio.currentTime/audio.duration) * 100;
    updateProgress(percentage);
}

window.onload = window.onresize = setScreenSize;