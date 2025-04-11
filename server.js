const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB URI
mongoose.connect("mongodb://sv1.nrosaitama.click:27017/plantaApp");

// User Schema
const userSchema = new mongoose.Schema({
    username: String,
    email: { type: String, unique: true },
    phone: String,
    password: String,
    address: String,
    avatar: String,
});
const User = mongoose.model("User", userSchema, "users"); // Tên collection "users"

const notificationSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    title: String,
    productName: String,
    image: String,
    date: String,
    quantity: Number,
});

module.exports = mongoose.model("Notification", notificationSchema);
// Product Schemas
const productSchema = new mongoose.Schema({
    id: String,
    image: String,
    name: String,
    price: String,
    onffo: String,
    status: String,
    size: String,
    origin: String,
});
const Tree = mongoose.model("Tree", productSchema, "product_tree");
const Pot = mongoose.model("Pot", productSchema, "product_pot");
const Tool = mongoose.model("Tool", productSchema, "product_tools");
const jwt = require("jsonwebtoken");
const Notification = mongoose.model("Notification", notificationSchema);
// Nếu dùng email để lấy user
app.get('/users', async (req, res) => {
    const { email } = req.query;
    try {
        const user = await User.findOne({ email }); // lỗi nằm ở đây
        res.json(user);
    } catch (err) {
        console.log("LỖI TRONG ROUTE /users:", err);
        res.status(500).json({ message: "Lỗi server" });
    }
});
app.post("/notifications", async (req, res) => {
    try {
      const { userId, title, productName, image, date, quantity } = req.body;
  
      const newNotification = new Notification({
        userId,
        title,
        productName,
        image,
        date,
        quantity,
      });
  
      await newNotification.save();
      res.status(201).json({ message: "Đã tạo thông báo thành công" });
    } catch (error) {
      console.error("Lỗi insert thông báo:", error);
      res.status(500).json({ error: "Server error" });
    }
  });
  
  app.get("/notifications", async (req, res) => {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ message: "Thiếu userId" });
  
    try {
      const notifications = await Notification.find({ userId }).sort({ date: -1 });
      res.json(notifications);
    } catch (error) {
      console.error("Lỗi server:", error);
      res.status(500).json({ message: "Lỗi server" });
    }
  });
  
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Sai email hoặc mật khẩu" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Sai email hoặc mật khẩu" });

        const token = jwt.sign({ id: user._id }, "secret-key", { expiresIn: "7d" });

        res.status(200).json({
            message: "Đăng nhập thành công",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                phone: user.phone,
            },
            token,
        });
    } catch (err) {
        console.error("Lỗi đăng nhập:", err);
        res.status(500).json({ message: "Lỗi server" });
    }
});

// Register API
app.post("/register", async (req, res) => {
    const { username, email, phone, password } = req.body;

    if (!username || !email || !phone || !password) {
        return res.status(400).json({ message: "Thiếu thông tin" });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email đã được đăng ký" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            email,
            phone,
            password: hashedPassword,
        });

        await newUser.save();
        res.status(201).json({ message: "Đăng ký thành công" });
    } catch (error) {
        console.error("Lỗi đăng ký:", error);
        res.status(500).json({ message: "Lỗi server" });
    }
});

// Get Product APIs
app.get("/product_trees", async (req, res) => {
    const trees = await Tree.find();
    res.json(trees);
});

app.get("/product_pots", async (req, res) => {
    const pots = await Pot.find();
    res.json(pots);
});

app.get("/product_tools", async (req, res) => {
    const tools = await Tool.find();
    res.json(tools);
});


app.put("/update-user/:id", async (req, res) => {
    console.log("BODY NHẬN VỀ:", req.body); // 👈 Log body kiểm tra
  
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: {
            username: req.body.username,
            email: req.body.email,
            phone: req.body.phone,
            avatar: req.body.avatar,
            address: req.body.address,
          },
        },
        { new: true }
      );
      res.json(updatedUser);
    } catch (err) {
      console.error("Update Error:", err);
      res.status(500).json({ error: "Lỗi cập nhật thông tin người dùng" });
    }
  });  
  
const svername = "157.10.45.123";
app.listen(3000, svername, () =>
    console.log("Server chạy tại http://" + svername + ":3000")
);
