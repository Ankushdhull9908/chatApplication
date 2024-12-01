const express = require("express");
const http = require("http"); // Needed to integrate socket with express
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const { Server } = require("socket.io");
const session = require("express-session");
const axios = require('axios');


dotenv.config();
const app = express();
const server = http.createServer(app); // Create HTTP server

// Configure CORS
app.use(cors({
  origin: ["http://localhost:3000"],  // Only allow your frontend domain
  methods: ["GET", "POST", "PUT", "DELETE"],  // Allow the necessary HTTP methods
  credentials: true,  // Allow credentials (cookies or authorization headers)
}));



// Middleware for parsing JSON
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});
app.use(express.json());
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true, // Helps protect from XSS attacks
    secure: false, // Set to true if using HTTPS
  }
}));

// Connect to MongoDB

mongoose.connect(process.env.mongouri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Database connected"))
  .catch((error) => console.log("Database connection error:", error));

// User schema and model
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 3, maxlength: 30 },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 3 }
});

const MessageSchema = new mongoose.Schema({
  conversationId:{
    type:[String],
    required:true
  },
  sender:{
    type:String,
    required:true
  },
  receiver:{
    type:String,
    required:true
  },
  

  time: { type: Date, default: Date.now },
  
  message:{
    type:String,
    required:true
  }
  
})

const Message = mongoose.model("Chats",MessageSchema);

const User = mongoose.model("UserData", userSchema);

app.post('/message',async (req,res)=>{

     const {conversationId,sender,receiver,time,message} = req.body;

     const chatdata = new Message({conversationId,sender,receiver,time,message});
    await chatdata.save();
    res.status(201).json("Message sent");
})

app.get('/allchats/:conversationId', async (req, res) => {
  const conversationId = req.params.conversationId.split(',');

  try {
   
    const result = await Message.find({
    conversationId: { $all: conversationId }
}).sort({ time: 1 }); // Sort by time in ascending order
    
   res.status(200).json(result); // Send sorted messages as response
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

app.post('/deletechat/:idtodelete', async (req, res) => {
  const idtodelete = req.params.idtodelete.split(',')
  try {
    const result = await Message.deleteMany({conversationId:idtodelete });
    if (result.deletedCount > 0) {
      res.status(200).json({ message: "Chat deleted successfully" });
    } else {
      res.status(404).json({ message: "No chats found to delete" });
    }
  } catch (error) {
    res.status(500).json({ error: "An error occurred while deleting the chat", details: error.message });
  }
});



// Routes for Register and Login
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json("User already exists");

    const newUser = new User({ name, email, password });
    await newUser.save();
    res.status(201).json("User registered successfully");
  } catch (error) {
    console.error(error);
    res.status(500).json("Server error");
  }
});



app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (!user) return res.status(400).json("Invalid credentials");

    res.status(200).json({ message: "Login successful", name: user.name });
  } catch (error) {
    console.error(error);
    res.status(500).json("Server error");
  }
});

// Setting up Socket.io with CORS
const io = new Server(server, {
    cors: {
      origin: ["http://localhost:3200","http://localhost:3000"],
      methods: ["GET", "POST"]
    }
  });
  

// Socket logic
const users = []; // Store user sockets by recipient ID

io.on("connection", (socket) => {
  socket.on('user-joined', (name) => {
    const userInfo = { id: socket.id, name };
  
    // Avoid duplicates
    const isDuplicateUser = users.some(user => user.name === name);
  
    if (!isDuplicateUser && name) {
      users.push(userInfo);
      console.log("User joined:", userInfo);
    } else {
      console.log("User already exists:", name);
    }
  
    console.log("Connected users:", users);
  });
  

    socket.on('msgfromclient', async (msg, recipient, sender) => {
      console.log("Message from client:", { msg, recipient, sender });
    
      try {
        // Find recipient's socket ID
        const recipientUser = users.find(user => user.name === recipient); 
    
        if (recipientUser) {
          console.log("Sending message to:", recipientUser.name);
    
          // Broadcast the message to the recipient
          socket.to(recipientUser.id).emit('broadcastmsg', msg, sender);
          console.log("MESSAGE SENDED")

        } else {
          console.log("Recipient not connected");
        }
      } catch (error) {
        console.error("Error handling message:", error);
      }
    });

   
    

    // Handle user disconnecting
    socket.on('disconnect', () => {
        // Remove the disconnected user from the list
        const index = users.findIndex(user => user.id === socket.id);
        if (index !== -1) {
            console.log(`User disconnected: ${users[index].name}`);
            users.splice(index, 1); // Remove user from array
        }
        console.log("Updated users list:", users);
    });
});

// Start the server
const PORT = process.env.PORT || 3200;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});


