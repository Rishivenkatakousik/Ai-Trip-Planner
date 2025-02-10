const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

const GOOGLE_MAPS_API_KEY = "AIzaSyA46lC4ZXV8lBGU8G4b9U59_6YYxkVJKm4"; // Replace with your actual API key

// Function to fetch places based on query
const fetchPlaces = async (query) => {
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&key=${GOOGLE_MAPS_API_KEY}`;
    const response = await axios.get(url);
    return response.data;
};

// Function to fetch place details using place_id
const fetchPhotoReference = async (placeId) => {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeId}&key=${GOOGLE_MAPS_API_KEY}`;
    const response = await axios.get(url);
    const photos = response.data?.result?.photos;
    return photos?.length ? photos[0].photo_reference : null;
};

// Endpoint to fetch places based on query
app.get("/places", async (req, res) => {
    try {
        const query = req.query.query;
        if (!query) return res.status(400).json({ error: "Query is required" });

        const data = await fetchPlaces(query);
        const placeId = data?.results[0]?.place_id;
        if (!placeId) return res.status(404).json({ error: "No place found" });

        res.json({ placeId });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch places" });
    }
});

// Endpoint to fetch photo reference
app.get("/photoRef", async (req, res) => {
    try {
        const placeId = req.query.placeId;
        if (!placeId) return res.status(400).json({ error: "placeId is required" });

        const photoRef = await fetchPhotoReference(placeId);
        if (!photoRef) return res.status(404).json({ error: "No photo found" });

        res.json({ photoRef });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch photo reference" });
    }
});

app.listen(5000, () => console.log("Server running on port 5000"));
