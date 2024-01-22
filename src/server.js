import http from "node:http";
import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import session from "express-session";
import MongoStore from "connect-mongo";
import { connectDB } from "./config/db.js";
import { Server } from "socket.io";
import { usersRouter } from "./routes/users.routes.js";
import { authRouter } from "./routes/auth.routes.js";
import { fileURLToPath } from "url";

import { productsRouter } from "./routes/products.routes.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Configuracion del servidor
// ----------------------------------------------------------------
// Creo una aplicacion express
const app = express();
//Creo el servidor http con la configuracion de express
const server = http.createServer(app);
//Creo el servidor de websocket con la configuracion del servidor http
const io = new Server(server);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: "mongodb://127.0.0.1:27017/CuentaTienda",
    }),
    cookie: {
      secure: false,
    },
  })
);

app.use(cookieParser());

app.use("/", express.static(path.join(__dirname, "../public")));

// Configuracion de la aplicacion
// ----------------------------------------------------------------
// Indico que la carpeta 'public' es estatica

// Configuracion de los websockets
// ----------------------------------------------------------------
// Cuando un cliente se conecta
io.on("connection", (socket) => {
  // El socket es el cliente
  console.log("Un cliente se ha conectado", socket.id);

  // Cuando el cliente envia un mensaje
  socket.on("message", ({ data }) => {
    console.log("Mensaje recibido", data);

    // Envio el mensaje a todos los clientes
    // socket.broadcast.emit("message", { name, message}) ---> todos menos quien envio el mensaje
    io.emit("message", { data });
  });

  socket.on("typing", (data) => {
    console.log("Escribiendo", data);

    // Envio el mensaje a todos los clientes
    socket.broadcast.emit("typing", data);
    // Envio el mensaje a todos los clientes menos al que lo envio
  });

  socket.on("stopTyping", (data) => {
    console.log("Dejo de escribir");

    // Envio el mensaje a todos los clientes
    socket.broadcast.emit("stopTyping", data);
    // Envio el mensaje a todos los clientes menos al que lo envio
  });

  // Cuando el clientese desconecta
  socket.on("disconnect", () => {
    console.log("El cliente se ha desconectado", socket.id);
  });
});

app.use("/products", productsRouter);
app.use("/users", usersRouter);
app.use("/auth", authRouter);

// Inicio el servidor
// ----------------------------------------------------------------
const main = async () => {
  try {
    await connectDB();
    server.listen(8080, () =>
      console.log("Servidor iniciado en http://localhost:8080")
    );
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

main();

export { io };
