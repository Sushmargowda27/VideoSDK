const menu = document.getElementById("menu");
const newMeetingBtn = document.getElementById("newmeeting");
const joinMeetingBtn = document.getElementById("joinmeeting");
const userName = document.getElementById("user_name");

const newMeetingSection = document.getElementById("newMeetingSection");
const tokenDisplay = document.getElementById("tokenDisplay");
const back1 = document.getElementById("back1");

const joinMeetingSection = document.getElementById("joinMeetingSection");
const meetingIdInput = document.getElementById("meetingIdInput");
const joinById = document.getElementById("joinById");
const back2 = document.getElementById("back2");
const videoContainer = document.getElementById("videoContainer");

const leaveButton = document.getElementById("leaveBtn");
const toggleMicButton = document.getElementById("toggleMicBtn");
const toggleWebCamButton = document.getElementById("toggleWebCamBtn");

const svg_leave = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" width="12" height="12"><path d="M183.1 137.4C170.6 124.9 150.3 124.9 137.8 137.4C125.3 149.9 125.3 170.2 137.8 182.7L275.2 320L137.9 457.4C125.4 469.9 125.4 490.2 137.9 502.7C150.4 515.2 170.7 515.2 183.2 502.7L320.5 365.3L457.9 502.6C470.4 515.1 490.7 515.1 503.2 502.6C515.7 490.1 515.7 469.8 503.2 457.3L365.8 320L503.1 182.6C515.6 170.1 515.6 149.8 503.1 137.3C490.6 124.8 470.3 124.8 457.8 137.3L320.5 274.7L183.1 137.4z"/></svg>`;

// Declare Variables
let meeting = null;
let meetingId = "";
let token1 = "";
let token2 = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlrZXkiOiI1YjYxMjA0NS1lNTZkLTRlY2MtOTQzZi1mNDAwNGU1YjJmODQiLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIl0sImlhdCI6MTc1NzQwMjg5MSwiZXhwIjoxNzcyOTU0ODkxfQ.NSiffESim8plAwVXNYwRKFBZrPni-cqgesxfNxJ7QHU";
let isMicOn = false;
let isWebCamOn = false;

function initializeMeeting() {}

function createLocalParticipant() {}

function createVideoElement() {}

function createAudioElement() {}

function setTrack() {}

//Show the New meeting button clciked
newMeetingBtn.addEventListener('click', async()=>{
  leaveButton.innerHTML = `${svg_leave}`;
  menu.classList.add("hidden"); //hidding the menu div
  newMeetingSection.classList.remove("hidden"); // showing the new meeting section
  try {
    // Step 1 – Get Token calling the backend API http://localhost:5001/api/token
    const res = await fetch("/api/token", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });  // Your backend token API
    const data = await res.json();
    token1=data.token; // storing the generated token to the variable(token1)
    
    // Step 2 – Create Meeting Room passing the generated token as a authorization parameter
    const url = "https://api.videosdk.live/v2/rooms";
    const options = {
      method: "POST",
      headers: {
        Authorization: token1,
        "Content-Type": "application/json"
      },
    };

    const roomRes = await fetch(url, options);
    const roomData = await roomRes.json();
    
    meetingId = roomData.roomId;

    newMeetingSection.classList.add("hidden");

    try {
      await initializeMeeting();
    } catch (error) {
      console.error("Meeting initialization failed:", error);
    }
  } catch (err) {
    tokenDisplay.textContent = "Error fetching token or creating meeting";
    console.error(err);
  }
});

// Initialize meeting
async function initializeMeeting() {

  window.VideoSDK.config(token1);
  
  meeting = window.VideoSDK.initMeeting({
    meetingId: meetingId, // required
    name: userName.value, // required
    micEnabled: true, // optional, default: true
    webcamEnabled: true, // optional, default: true
  });


  meeting.localParticipant.on("stream-enabled", (stream) => {
    setTrack(stream, null, meeting.localParticipant, true);
  });

  // meeting joined event
  meeting.on("meeting-joined", () => {
      
    // textDiv.style.display = "none";
    document.getElementById("grid-screen").style.display = "block";
    document.getElementById(
    "meetingIdHeading"
    ).textContent = `Meeting Id: ${meetingId}`;
  });

    // participant joined
    meeting.on("participant-joined", (participant) => {
      
      let videoElement = createVideoElement(
        participant.id,
        participant.displayName
      );
      let audioElement = createAudioElement(participant.id);
      // stream-enabled
      participant.on("stream-enabled", (stream) => {
        setTrack(stream, audioElement, participant, false);
      });
      videoContainer.appendChild(videoElement);
      videoContainer.appendChild(audioElement);
    });

    // participants left
    meeting.on("participant-left", (participant) => {
      let vElement = document.getElementById(`f-${participant.id}`);
      vElement.remove(vElement);

      let aElement = document.getElementById(`a-${participant.id}`);
      aElement.remove(aElement);
    });

  try {
    await meeting.join();

    // Creating local participant
    createLocalParticipant()

  } catch(err){
    console.error(err,"line 159");
  }
}

// creating video element
function createVideoElement(pId, name) {
  
  let videoFrame = document.createElement("div");
  videoFrame.setAttribute("id", `f-${pId}`);

  //create video
  let videoElement = document.createElement("video");
  videoElement.classList.add("video-frame");
  videoElement.setAttribute("id", `v-${pId}`);
  videoElement.setAttribute("playsinline", true);
  videoElement.setAttribute("width", "300");
  videoFrame.appendChild(videoElement);

  let displayName = document.createElement("div");
  displayName.innerHTML = `Name : ${name}`;
 
  videoFrame.appendChild(displayName);
  return videoFrame;
}

// creating audio element
function createAudioElement(pId) {
  let audioElement = document.createElement("audio");
  audioElement.setAttribute("autoPlay", "false");
  audioElement.setAttribute("playsInline", "true");
  audioElement.setAttribute("controls", "false");
  audioElement.setAttribute("id", `a-${pId}`);
  audioElement.style.display = "none";
  return audioElement;
}

// creating local participant
function createLocalParticipant() {

  let localParticipant = createVideoElement(
    meeting.localParticipant.id,
    meeting.localParticipant.displayName
  );

  videoContainer.appendChild(localParticipant);
}

// setting media track
function setTrack(stream, audioElement, participant, isLocal) {
  if (stream.kind == "video") {
    isWebCamOn = true;
    const mediaStream = new MediaStream();
    mediaStream.addTrack(stream.track);
    let videoElm = document.getElementById(`v-${participant.id}`);
    videoElm.srcObject = mediaStream;
    videoElm
      .play()
      .catch((error) =>
        console.error("videoElem.current.play() failed", error)
      );
  }
  if (stream.kind == "audio") {
    if (isLocal) {
      isMicOn = true;
    } else {
      const mediaStream = new MediaStream();
      mediaStream.addTrack(stream.track);
      audioElement.srcObject = mediaStream;
      audioElement
        .play()
        .catch((error) => console.error("audioElem.play() failed", error));
    }
  }
}

// Toggle Mic Button Event Listener
toggleMicButton.addEventListener("click", async () => {
    //Font Awesome for Webcam and Mic
  const svgIcon_micUnmuted = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" width="12" height="12"><path d="M320 64C267 64 224 107 224 160L224 288C224 341 267 384 320 384C373 384 416 341 416 288L416 160C416 107 373 64 320 64zM176 248C176 234.7 165.3 224 152 224C138.7 224 128 234.7 128 248L128 288C128 385.9 201.3 466.7 296 478.5L296 528L248 528C234.7 528 224 538.7 224 552C224 565.3 234.7 576 248 576L392 576C405.3 576 416 565.3 416 552C416 538.7 405.3 528 392 528L344 528L344 478.5C438.7 466.7 512 385.9 512 288L512 248C512 234.7 501.3 224 488 224C474.7 224 464 234.7 464 248L464 288C464 367.5 399.5 432 320 432C240.5 432 176 367.5 176 288L176 248z"/></svg>`;
  const svgIcon_micMuted = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" width="12" height="12"><path d="M73 39.1C63.6 29.7 48.4 29.7 39.1 39.1C29.8 48.5 29.7 63.7 39 73.1L567 601.1C576.4 610.5 591.6 610.5 600.9 601.1C610.2 591.7 610.3 576.5 600.9 567.2L456.7 422.8C490.9 388.2 512 340.6 512 288L512 248C512 234.7 501.3 224 488 224C474.7 224 464 234.7 464 248L464 288C464 327.3 448.3 362.9 422.7 388.9L388.8 355C405.6 337.7 416 314 416 288L416 160C416 107 373 64 320 64C267 64 224 107 224 160L224 190.2L73 39.2zM371.3 473.1L329.9 431.7C326.6 431.9 323.4 432 320.1 432C240.6 432 176.1 367.5 176.1 288L176.1 277.8L132.5 234.2C129.7 238.1 128.1 242.9 128.1 248L128.1 288C128.1 385.9 201.4 466.7 296.1 478.5L296.1 528L248.1 528C234.8 528 224.1 538.7 224.1 552C224.1 565.3 234.8 576 248.1 576L392.1 576C405.4 576 416.1 565.3 416.1 552C416.1 538.7 405.4 528 392.1 528L344.1 528L344.1 478.5C353.4 477.3 362.5 475.5 371.4 473.1z"/></svg>`;

  if (isMicOn) {
    // Disable Mic in Meeting
    meeting?.muteMic();
    toggleMicButton.innerHTML=`${svgIcon_micMuted} `;
  } else {
    // Enable Mic in Meeting
    meeting?.unmuteMic();
    toggleMicButton.innerHTML=`${svgIcon_micUnmuted} `;
  }
  isMicOn = !isMicOn;
});

// Toggle Web Cam Button Event Listener
toggleWebCamButton.addEventListener("click", async () => {

  //Font Awesome for Webcam
  const svgIcon_webcammuted = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" width="12" height="12"><path d="M73 39.1C63.6 29.7 48.4 29.7 39.1 39.1C29.8 48.5 29.7 63.7 39 73.1L567 601.1C576.4 610.5 591.6 610.5 600.9 601.1C610.2 591.7 610.3 576.5 600.9 567.2L447.9 414.2L447.9 192C447.9 156.7 419.2 128 383.9 128L161.8 128L73 39.1zM64 192L64 448C64 483.3 92.7 512 128 512L384 512C391.8 512 399.3 510.6 406.2 508L68 169.8C65.4 176.7 64 184.2 64 192zM496 400L569.5 458.8C573.7 462.2 578.9 464 584.3 464C597.4 464 608 453.4 608 440.3L608 199.7C608 186.6 597.4 176 584.3 176C578.9 176 573.7 177.8 569.5 181.2L496 240L496 400z"/></svg>`;
  const svgIcon_webcamUnMuted = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" width="12" height="12"><path d="M128 128C92.7 128 64 156.7 64 192L64 448C64 483.3 92.7 512 128 512L384 512C419.3 512 448 483.3 448 448L448 192C448 156.7 419.3 128 384 128L128 128zM496 400L569.5 458.8C573.7 462.2 578.9 464 584.3 464C597.4 464 608 453.4 608 440.3L608 199.7C608 186.6 597.4 176 584.3 176C578.9 176 573.7 177.8 569.5 181.2L496 240L496 400z"/></svg>`;

  if (isWebCamOn) {
    // Disable Webcam in Meeting
    meeting?.disableWebcam();

    let vElement = document.getElementById(`f-${meeting.localParticipant.id}`);
    vElement.style.backgroundColor = "black";
    toggleWebCamButton.innerHTML=`${svgIcon_webcammuted}`; 
  } else {
  // Enable Webcam in Meeting
  meeting?.enableWebcam();

  let vElement = document.getElementById(`f-${meeting.localParticipant.id}`);
  vElement.style.backgroundColor = "";
  toggleWebCamButton.innerHTML=`${svgIcon_webcamUnMuted}`;
  }
  isWebCamOn = !isWebCamOn;
});

// ===== Show Join Meeting Section ===
joinMeetingBtn.addEventListener('click',async() => {
  leaveButton.innerHTML = `${svg_leave}`;
  menu.classList.add("hidden");
  joinMeetingSection.classList.remove("hidden");
});

//====Back Button1 and 2=====
back1.addEventListener("click", () => {
    newMeetingSection.classList.add("hidden");
    menu.classList.remove("hidden");
});

back2.addEventListener("click",()=>{
    joinMeetingSection.classList.add("hidden");
    menu.classList.remove("hidden");
});

// === JoinMeeting ById====
joinById.addEventListener("click",async()=>{
    meetingId = meetingIdInput.value;
    if (meetingId) {
      joinMeetingSection.classList.add("hidden");

      const res = await fetch("/api/token", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });  // Your backend token API
    const data = await res.json();

    token1=data.token; // storing the generated token to the variable(token1)
      initializeMeeting();
      alert("Joining meeting: " + meetingId);
    } else {
      alert("Please enter a meeting ID!");
    }
});

//leave button
leaveButton.addEventListener("click",()=>{
  meeting?.leave();
  newMeetingSection.classList.add("hidden");
  videoContainer.innerHTML = "";
  document.getElementById("grid-screen").style.display = "none";
  menu.classList.remove("hidden");
  userName.value="";
  meetingIdInput.value="";
});