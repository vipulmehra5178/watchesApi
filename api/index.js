import express from "express";
import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
module.exports = app;
const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/watchstore", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB:", err));

// Define Review Schema
const ReviewSchema = new mongoose.Schema({
  user_name: { type: String, required: true },
  user_comment: { type: String },
  rating: { type: Number, min: 0, max: 5, required: true },
}, { timestamps: true });

// Define Watch Schema
const WatchSchema = new mongoose.Schema({
  id: { type: String, default: uuidv4 },
  title: { type: String, required: true },
  brand: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  images: { type: [String], required: true },
  categories: { type: [String], required: true },
  gender: { type: String, enum: ["Men", "Women", "Unisex"], required: true },
  availability: { type: Boolean, default: true },
  sku: { type: String, required: true, unique: true },
  technical_specs: {
    dial_size: { type: String },
    strap_material: { type: String },
    water_resistance: { type: String },
    movement_type: { type: String },
    battery_life: { type: String },
    features: { type: [String] },
  },
  rating: { type: Number, default: 0 },
  reviews: [ReviewSchema],
  inventory: {
    quantity_in_stock: { type: Number, default: 0 },
    restock_date: { type: Date },
  },
  manufacturer: { type: String },
  country_of_origin: { type: String },
  warranty_period: { type: String },
  shipping: {
    options: { type: [String] },
    charges: { type: Number, default: 0 },
    delivery_time: { type: String },
  },
  wishlist_count: { type: Number, default: 0 },
  purchase_count: { type: Number, default: 0 },
  promotion: {
    promotion_id: { type: String },
    description: { type: String },
  },
}, { timestamps: true });

// Create Watch Model
const Watch = mongoose.model("Watch", WatchSchema);

// Routes

// Get all watches
app.get("/watches", async (req, res) => {
  try {
    const watches = await Watch.find();
    res.json(watches);
  } catch (err) {
    res.status(500).send("Error fetching watches");
  }
});

// Get a specific watch
app.get("/watches/:id", async (req, res) => {
  try {
    const watch = await Watch.findOne({ id: req.params.id });
    if (!watch) return res.status(404).send("Watch not found.");
    res.json(watch);
  } catch (err) {
    res.status(500).send("Error fetching watch");
  }
});

// Add a new watch
app.post("/watches", async (req, res) => {
  try {
    const newWatch = new Watch(req.body); // Create a new watch document
    await newWatch.save(); // Save it to the database
    res.status(201).json(newWatch);
  } catch (err) {
    res.status(500).send("Error adding watch");
  }
});

// Update a watch
app.put("/watches/:id", async (req, res) => {
  try {
    const updatedWatch = await Watch.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    if (!updatedWatch) return res.status(404).send("Watch not found.");
    res.json(updatedWatch);
  } catch (err) {
    res.status(500).send("Error updating watch");
  }
});

// Delete a watch
app.delete("/watches/:id", async (req, res) => {
  try {
    const deletedWatch = await Watch.findOneAndDelete({ id: req.params.id });
    if (!deletedWatch) return res.status(404).send("Watch not found.");
    res.status(204).send();
  } catch (err) {
    res.status(500).send("Error deleting watch");
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
