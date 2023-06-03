var express = require("express");

var app = express();

app.use(express.static(__dirname + "/static"));
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

const server = app.listen(8001, function() {
    console.log("Listening to port 8001");
});

const io = require("socket.io")(server);

app.get("/", function(request, response) {
    response.render("index");
});

let bg_color = ""; // to set default bg-color upon connecting of new client
io.on("connection", function(socket) {
    socket.emit("greetings", { msg: "Hello, this is message from server"});
    socket.on("thankyou", function(data) {
        console.log(data.msg);
    });
    
    socket.on("light", function() {
        bg_color = "#E4E5F1";
        io.emit("bg_mode", bg_color);
    });
    socket.on("random", function() {
        const rgb = ['a','b','c','d','e','f','0','1','2','3','4','5','6','7','8','9'];
        let color = '#'  //this is what we'll return!
        for(let i = 0; i < 6; i++)   // 6 is total number of characters in hex
        {
            let x = Math.floor((Math.random()*16));  // 16 for hex
            color += rgb[x]; 
        }
        bg_color = color;
        io.emit("bg_mode", bg_color);
    });
    socket.on("dark", function() {
        bg_color = "#1E1E1E";
        io.emit("bg_mode", bg_color);
    });
    io.emit("bg_mode", bg_color); // setting the default bg-color
});