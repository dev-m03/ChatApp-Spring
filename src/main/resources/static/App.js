// Initialize the WebSocket connection
const stompClient = new StompJs.Client({
    brokerURL: 'ws://localhost:8080/gs-guide-websocket'
});

stompClient.onConnect = (frame) => {
    setConnected(true);
    console.log('Connected: ' + frame);

    // Subscribe to /topic/greetings for incoming messages
    stompClient.subscribe('/topic/greetings', (greeting) => {
        const messageData = JSON.parse(greeting.body); // Expecting JSON with 'name' and 'message'
        showGreeting(messageData.name, messageData.message);
    });
};

stompClient.onWebSocketError = (error) => {
    console.error('WebSocket error:', error);
};

stompClient.onStompError = (frame) => {
    console.error('STOMP error:', frame.headers['message']);
    console.error('Details:', frame.body);
};

// Update UI based on connection status
function setConnected(connected) {
    $("#connect").prop("disabled", connected);
    $("#disconnect").prop("disabled", !connected);
    $("#conversation").toggle(connected);  // Show chat only when connected

    if (!connected) {
        $("#greetings").html(""); // Clear chat when disconnected
    }
}

// Activate WebSocket connection
function connect() {
    stompClient.activate();
}

// Deactivate WebSocket connection
function disconnect() {
    stompClient.deactivate();
    setConnected(false);
    console.log("Disconnected");
}

// Send name and message to the server
function sendMessage() {
    const name = $("#name").val();
    const message = $("#message").val();

    if (name && message) {  // Only send if both fields are filled
        stompClient.publish({
            destination: "/app/hello",
            body: JSON.stringify({ 'name': name, 'message': message })
        });

        // Clear message field after sending
        $("#message").val('');
    }
}

// Display the message in the chat UI
function showGreeting(name, message) {
    $("#greetings").append(
        `<tr><td><strong>${name}:</strong> ${message}</td></tr>`
    );
}

// Event listeners for buttons and form
$(function () {
    $("form").on('submit', (e) => e.preventDefault());  // Prevent form submission
    $("#connect").click(() => connect());
    $("#disconnect").click(() => disconnect());
    $("#send").click(() => sendMessage());
});
