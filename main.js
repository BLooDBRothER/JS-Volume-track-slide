const btn = document.getElementById("play-btn");
const audio = document.querySelector("audio");
const body = document.querySelector("body");
const time = document.querySelector(".dur-time");
const volIc = document.querySelector(".volume-ic")

let screenWidth, screenHeight, midSize, startX, startY, setMode, volumeValue=100;

function setScreenSize(){
    screenWidth = window.screen.availWidth;
    screenHeight = window.screen.availHeight;
    midSize = Math.floor(screenHeight / 2);
}

function volumeChange(value){
    if((value == 0 && volumeValue <= 0) || (value == 1 && volumeValue >= 100)){
        volIc.src = "./Assests"
        return;
    } 
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
    if(setMode == "Volume" && e.touches[0].clientY < startY && (e.touches[0].clientX > (startX-20) && e.touches[0].clientX < (startX+20))){
        startY = e.touches[0].clientY;
        volumeChange(1);
    }
    else if(setMode == "Volume" && e.touches[0].clientY > startY && (e.touches[0].clientX > (startX-20) && e.touches[0].clientX < (startX+20))){
        startY = e.touches[0].clientY;
        volumeChange(0);
    }
    if(setMode == "track" && e.touches[0].clientX < startX && (e.touches[0].clientY > (startY-20) && e.touches[0].clientY < (startY+20))){
        startX = e.touches[0].clientX;
        trackChange(0); 
    }
    else if(setMode == "track" && e.touches[0].clientX > startX && (e.touches[0].clientY > (startY-20) && e.touches[0].clientY < (startY+20))){
        startX = e.touches[0].clientX;
        trackChange(1);
    }
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

audio.ontimeupdate = () =>{
    time.innerText = `${Math.floor(audio.currentTime/60)} : ${Math.floor(audio.currentTime%60)}`;
    let percentage = (audio.currentTime/audio.duration) * 100;
    updateProgress(percentage);
}

window.onload = window.onresize = setScreenSize;