const express = require("express");
const colors = require("colors");
const dotenv = require("dotenv").config();
const bodyParser = require("body-parser");
const cors = require("cors");
const connectDB = require("./config/db");
const allPropRoutes = require("./Routes/allPropRoutes")
const http = require("http");
const { Server } = require("socket.io");
const chatRoutes = require("./Routes/chatRoute");
const port = process.env.PORT || 5001;

// Connect to MongoDB
connectDB();


const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });
app.use(express.json());

// Middleware to enable CORS
app.use(cors({
  origin: "*", // Replace with your frontend URL
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

// Middleware for parsing requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// User Routes
app.use("/api", require("./Routes/userRoutes"));
app.use("/api", require("./Routes/userRoutes"));
app.use("/api/slider-images", require("./Routes/sliderImagesRoutes"));
app.use("/api/buy", require("./Routes/buyRoutes"));
app.use("/api/rent", require("./Routes/rentRoutes"));
app.use("/api/news", require("./Routes/newsRoutes"));
app.use("/api/allProp", allPropRoutes);
app.use("/api", require("./Routes/userAllpropRoute"));
app.use("/api/chats", chatRoutes);
app.use("/api", require("./Routes/roomRoutes"));
app.use("/api", require("./Routes/messageRoute"));



io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join_room", (roomId) => {
    socket.join(roomId);
    console.log(`User joined room: ${roomId}`);
  });

  socket.on("send_message", (data) => {
    io.to(data.roomId).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Global Error Handler (optional, if you plan to implement it)
// app.use(errorHandler);

// Start the server
app.listen(port, () => console.log(`Server started on port ${port}`.green));
server.listen(5000, () => console.log(`Server started on port 5000`.green));
