import { io } from "https://cdn.socket.io/4.7.3/socket.io.esm.min.js";

const socket = io();

const chat = document.querySelector("#chat");
const typing = document.querySelector("#typing");
const form = document.querySelector("form");
const messageInput = document.querySelector("#message");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = e.target.elements.name.value;
  const message = e.target.elements.message.value;

  socket.emit("message", { name, message });
  socket.emit("stopTyping", name);

  e.target.elements.message.value = "";
});

messageInput.addEventListener("input", (e) => {
  const name = e.target.form.elements.name.value;

  if (e.target.value == "") {
    socket.emit("stopTyping", name);
  } else {
    socket.emit("typing", name);
  }
});

socket.on("connect", () => {
  console.log("Conectado al servidor", socket.id);

  socket.on("message", ({ name, message }) => {
    chat.innerHTML += `<p><strong>${
      name || "Anonimo"
    }:</strong> ${message}</p>`;
  });

  socket.on("typing", (name) => {
    typing.innerHTML = `<p><em>${name} esta escribiendo ...</em></p>`;
  });

  socket.on("stopTyping", (name) => {
    typing.innerHTML = "";
  });

  socket.on("disconnect", () => {
    console.log("Desconectado del servidor");
  });
});
