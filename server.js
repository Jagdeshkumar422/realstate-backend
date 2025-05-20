const express = require("express");
const colors = require("colors");
const dotenv = require("dotenv").config();
const bodyParser = require("body-parser");
const cors = require("cors");
const connectDB = require("./config/db");
const allPropRoutes = require("./Routes/allPropRoutes");
const http = require("http");
const { Server } = require("socket.io");
const chatRoutes = require("./Routes/chatRoute");
const port = process.env.PORT || 5000; // Use single port

// Connect to MongoDB
connectDB();

const app = express();
const server = http.createServer(app); // Use this for Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*", // Replace with your frontend origin in production
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
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

// Socket.IO events
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

// Start server with both Express and Socket.IO
server.listen(port, () => {
  console.log(`Server with Socket.IO started on port ${port}`.green);
});
