# VideoSDK
This project is a web-based video conferencing application built using VideoSDK, enabling real-time video and audio communication between multiple participants. The frontend is developed using Vanilla JavaScript, and the backend is powered by Node.js.


# Features

1) Create a new video meeting room

2) Join an existing video meeting by ID

3) Display local and remote participants’ video streams

4) Handle participants joining and leaving in real-time

5) Mute/unmute mic, enable/disable webcam

6) Clean UI for easy interaction


# Tech Stack

Frontend: JavaScript, HTML, CSS

Backend: Node.js (for token generation & API handling)

VideoSDK: Web SDK for real-time communication


# How it works

📋User can create a new meeting → A VideoSDK token is generating and fetched from the backend and a meeting room is created.

📋User can join an existing meeting by entering the meeting ID.

📋Participant's video streams are displayed dynamically in the browser.


# Developer Setup
1️) Install Node.js
https://nodejs.org/

2️) Clone the repository
git clone https://github.com/Sushmargowda27/VideoSDK.git

3️) Create a VideoSDK Account
https://www.videosdk.live/

4️) Configure API Keys
Copy your API Key and Secret Key from the VideoSDK dashboard.
added it on .env file in the project root.

    API_KEY=YOUR_API_KEY

    SECRET_KEY=YOUR_SECRET_KEY

5️) Install Dependencies in the project root

    cd VideoSDK
   
    npm install

6️) Run the Development Server

    npm run dev
   
The app will be available at:
https://localhost:5001
