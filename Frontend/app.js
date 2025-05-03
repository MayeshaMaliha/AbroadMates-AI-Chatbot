const rasaServerUrl = "https://chat.abroadmates.com/webhooks/rest/webhook";

function sendMessage() {
  const inputField = document.getElementById("user-input");
  const message = inputField.value.trim();
  if (!message) return;

  addMessage(message, "user");
  inputField.value = "";

  fetch(rasaServerUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sender: "user", message: message })
  })
  .then(res => res.json())
  .then(data => {
    if (data.length > 0) {
      data.forEach((res) => {
        if (res.text) {
          addMessage(res.text, "bot");
        }
      });
    } else {
      addMessage("⚠️ No response from server.", "bot");
    }
  })
  .catch(err => {
    console.error("Error:", err);
    addMessage("❌ Failed to reach the server.", "bot");
  });
}

function addMessage(text, role) {
  const chatBox = document.getElementById("chat-box");
  const msg = document.createElement("div");
  msg.className = `message ${role}`;
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}
