let IP_ADDRESS = "";
const API_KEY = "at_JF6nHlo3eXMTBGDbMCVngmIXm2vAt";

// DOM Elements
const searchForm = document.querySelector(".search-form");
const searchInput = document.querySelector("#user-input");
const searchButton = document.querySelector("#search-button");
const ipAddressElement = document.querySelector("#ip-address");
const locationElement = document.querySelector("#location");
const timezoneElement = document.querySelector("#timezone-offset");
const ispElement = document.querySelector("#isp");

// Initialize map without zoom controls
let map = L.map("map", {
  zoomControl: false, // Disable zoom controls
}).setView([51.505, -0.09], 13);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 20,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

// Define a custom icon
const customIcon = L.icon({
  iconUrl: "./images/icon-location.svg", // Replace with the path to your image
  iconSize: [38, 48], // Size of the icon [width, height]
  iconAnchor: [19, 38], // Point of the icon which will correspond to marker's location
  popupAnchor: [0, -38], // Point from which the popup should open relative to the iconAnchor
});

// Add marker with custom icon
let marker = L.marker([0, 0], { icon: customIcon }).addTo(map);

var popup = L.popup();

function onMapClick(e) {
  popup
    .setLatLng(e.latlng)
    .setContent("You clicked the map at <br>" + e.latlng.toString())
    .openOn(map);
}

map.on("click", onMapClick);
// Function to update UI with IP data
function updateUI(data) {
  console.log(data);
  ipAddressElement.textContent = data.ip ?? "UNKNOWN";
  locationElement.textContent =
    data.location?.city && data.location?.region
      ? `${data.location.city}, ${data.location.region} ${
          data.location.postalCode ?? ""
        }`
      : "UNKNOWN";
  timezoneElement.textContent = data.location?.timezone ?? "UNKNOWN";
  ispElement.textContent = data.isp ?? "UNKNOWN";

  // Update map
  const { lat, lng } = data.location;
  map.setView([lat, lng], 13);

  // Adjust the center slightly lower
  map.panBy([0, -400]); // Shift the map by 100 pixels downward

  marker.setLatLng([lat, lng]);
  marker
    .addTo(map)
    .bindPopup(`You are here! <br>Latitude: ${lat} <br> Longitude: ${lng}`)
    .openPopup();
}

// Function to fetch IP data
async function fetchIPData(ipAddress = "8.8.8.8") {
  try {
    const API_URL = `https://geo.ipify.org/api/v2/country,city?apiKey=${API_KEY}&ipAddress=${ipAddress}`;
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("Failed to fetch IP data");
    }
    const data = await response.json();

    updateUI(data);
  } catch (error) {
    console.error("Error:", error);
    alert("Error while fetching IP data. Please try again later.");
  }
}

// Event Listeners
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  IP_ADDRESS = searchInput.value.trim();
  fetchIPData(IP_ADDRESS);
});

// Initial load with user's IP
fetchIPData();
