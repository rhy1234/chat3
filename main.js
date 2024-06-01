// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, onChildAdded } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyChj8_V2Ys_iBAWtprbVFYSUXOnIyClsYY",
  authDomain: "chat-519ad.firebaseapp.com",
  projectId: "chat-519ad",
  storageBucket: "chat-519ad.appspot.com",
  messagingSenderId: "882260789874",
  appId: "1:882260789874:web:a838daba4c6d54f96090eb",
  measurementId: "G-4Q695PV3CG",
  databaseURL: "https://chat-519ad-default-rtdb.firebaseio.com/"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Function to send a message
window.sendMessage = function() {
    const messageInput = document.getElementById("message-input");
    const message = messageInput.value.trim();
    if (message !== "") {
        push(ref(database, 'messages'), {
            message: message,
            timestamp: Date.now()
        }).then(() => {
            messageInput.value = "";
        }).catch(error => {
            console.error("Error sending message: ", error);
        });
    }
};

// Function to display messages
function displayMessage(message, isSent) {
    const chatBox = document.getElementById("chat-box");
    const messageElement = document.createElement("div");
    messageElement.classList.add(isSent ? "sent-message" : "received-message");
    messageElement.innerText = message;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Listen for new messages
onChildAdded(ref(database, 'messages'), (snapshot) => {
    const messageData = snapshot.val();
    displayMessage(messageData.message, false);
    notifyUser(messageData.message);
});

// Notification function
function notifyUser(message) {
    if (!("Notification" in window)) {
        alert("This browser does not support desktop notification");
    } else if (Notification.permission === "granted") {
        new Notification("New Message", { body: message });
    } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                new Notification("New Message", { body: message });
            }
        });
    }
}
