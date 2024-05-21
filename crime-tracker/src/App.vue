<script setup>
import { reactive, ref, onMounted, computed } from "vue";

let crime_url = ref("");
let dialog_err = ref(false);

let case_number = ref("");
let date = ref("");
let time = ref("");
let code = ref("");
let incident = ref("");
let police_grid = ref("");
let neighborhood_number = ref("");
let block = ref("");

let map = reactive({
  leaflet: null,
  center: {
    lat: 44.955139,
    lng: -93.102222,
    address: "",
  },
  zoom: 12,
  bounds: {
    nw: { lat: 45.008206, lng: -93.217977 },
    se: { lat: 44.883658, lng: -92.993787 },
  },
  neighborhood_markers: [
    {
      location: [44.942068, -93.020521],
      marker: true,
      name: "Southeast",
      count: 0,
    },
    {
      location: [44.977413, -93.025156],
      marker: true,
      name: "Greater East Side",
      count: 0,
    },
    {
      location: [44.931244, -93.079578],
      marker: true,
      name: "West Side",
      count: 0,
    },
    {
      location: [44.956192, -93.060189],
      marker: true,
      name: "Dayton's Bluff",
      count: 0,
    },
    {
      location: [44.978883, -93.068163],
      marker: true,
      name: "Payne/Phalen",
      count: 0,
    },
    {
      location: [44.975766, -93.113887],
      marker: true,
      name: "North End",
      count: 0,
    },
    {
      location: [44.959639, -93.121271],
      marker: true,
      name: "Frogtown",
      count: 0,
    },
    {
      location: [44.9477, -93.128505],
      marker: true,
      name: "Summit/University",
      count: 0,
    },
    {
      location: [44.930276, -93.119911],
      marker: true,
      name: "West Seventh",
      count: 0,
    },
    { location: [44.982752, -93.14791], marker: true, name: "Como", count: 0 },
    {
      location: [44.963631, -93.167548],
      marker: true,
      name: "Hamline/Midway",
      count: 0,
    },
    {
      location: [44.973971, -93.197965],
      marker: true,
      name: "St. Anthony",
      count: 0,
    },
    {
      location: [44.949043, -93.178261],
      marker: true,
      name: "Union Park",
      count: 0,
    },
    {
      location: [44.934848, -93.176736],
      marker: true,
      name: "Macalester-Groveland",
      count: 0,
    },
    {
      location: [44.913106, -93.170779],
      marker: true,
      name: "Highland",
      count: 0,
    },
    {
      location: [44.937705, -93.136997],
      marker: true,
      name: "Summit Hill",
      count: 0,
    },
    {
      location: [44.949203, -93.093739],
      marker: true,
      name: "Downtown",
      count: 0,
    },
  ],
});
let latitude = ref(44.955139);
let longitude = ref(-93.102222);
let address = ref(
  "Minnesota State Capitol, 75, Reverend Doctor Martin Luther King Junior Boulevard, Downtown, Saint Paul, Ramsey County, Minnesota, 55155, United States"
);
let showAddress = ref("off");
let crimes = ref([]);
let violent = ['Homicide', 'Rape', 'Agg. Assault', 'Simple Assault Dom.', 'Agg. Assault Dom.'];
let property = ['Burglary', 'Theft', 'Auto Theft', 'Arson', 'Vandalism/Graffiti', 'Robbery', 'Criminal Damage'];
let other = ['Narcotics', 'Discharge', 'Proactive Police Visit', 'Community Event'];

//array to convert neighborhood number to neighboorhood name
let neighborhood_names = [
  "Southeast",
  "Greater East Side",
  "West Side",
  "Dayton's Bluff",
  "Payne/Phalen",
  "North End",
  "Frogtown",
  "Summit/University",
  "West Seventh",
  "Como",
  "Hamline/Midway",
  "St. Anthony",
  "Union Park",
  "Macalester-Groveland",
  "Highland",
  "Summit Hill",
  "Downtown",
];

let incidentTypes = [
  "Homicide",
  "Rape",
  "Robbery",
  "Aggravated Assault",
  "Burglary",
  "Theft",
  "Auto Theft",
  "Simple Assault",
  "Arson",
  "Vandalism/Graffiti",
  "Narcotics",
  "Discharge",
  "Proactive Police Visit",
  "Community Engagement Event",
];
let filterInfo = reactive({
  code: [],
  neighborhood: [],
  sDate: null,
  eDate: null,
  limit: "",
  delete: null,
});
let markers = [];
const tableUpdateOnZoom = ref(0);


//alternate marker color
var greenIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Vue callback for once <template> HTML has been added to web page
onMounted(() => {
  // Create Leaflet map (set bounds and valied zoom levels)
  map.leaflet = L.map("leafletmap").setView(
    [map.center.lat, map.center.lng],
    map.zoom
  );
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    minZoom: 11,
    maxZoom: 18,
  }).addTo(map.leaflet);
  map.leaflet.setMaxBounds([
    [44.883658, -93.217977],
    [45.008206, -92.993787],
  ]);

  // Get boundaries for St. Paul neighborhoods
  let district_boundary = new L.geoJson();
  district_boundary.addTo(map.leaflet);
  fetch("data/StPaulDistrictCouncil.geojson")
    .then((response) => {
      return response.json();
    })
    .then((result) => {
      result.features.forEach((value) => {
        district_boundary.addData(value);
      });
    })
    .catch((error) => {
      console.log("Error:", error);
    });

  //make markers for the map
  for (let i = 0; i < map.neighborhood_markers.length; i++) {
    let location = map.neighborhood_markers[i];
    if (location.marker === true) {
      markers[i] = L.marker([location.location[0], location.location[1]])
        .addTo(map.leaflet)
        .bindPopup(
          location.name + " - Number of Crimes displayed: " + location.count
        );
    } else {
      map.leaflet.removeLayer(markers[i]);
    }
  }

  // Update location when user drags the map
  map.leaflet.on("dragend", (e) => {
    const newCenter = e.target.getCenter();
    latitude.value = newCenter.lat;
    longitude.value = newCenter.lng;
    fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude.value}&lon=${longitude.value}`
    )
      .then((response) => response.json())
      .then((data) => {
        address.value = data.display_name;
      })
      .catch((error) => {
        console.error("Error fetching address:", error);
      });
    drawMarkers();
  });
  map.leaflet.on("zoomend", () => {
    tableUpdateOnZoom.value += 1;
    drawMarkers();
  });
});

// FUNCTIONS
// Function called once user has entered REST API URL
function initializeCrimes() {
  // Get the base URL from the user input
  const baseUrl = crime_url.value;

  // Get the map bounds
  const mapBounds = map.leaflet.getBounds();
  const sw = mapBounds.getSouthWest();
  const ne = mapBounds.getNorthEast();

  // Fetch incidents with map bounds
  fetch(
    `${baseUrl}/incidents?swLat=${sw.lat}&swLng=${sw.lng}&neLat=${ne.lat}&neLng=${ne.lng}`
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      crimes.value = data;
      console.log(crimes.valueOf());
      for (let i = 0; i < data.length; i++) {
        map.neighborhood_markers[data[i].neighborhood_number - 1].count++;
      }
      drawMarkers();
    })
    .catch((error) => {
      console.error("Error fetching crimes:", error);
    });
}

// Function called to filter the crimes
function updateCrimes() {
  if (crime_url.value != "") {
    let updateUrl = crime_url.value + "/incidents";
    console.log(filterInfo);
    if (filterInfo.code.length != 0) {
      updateUrl += "?code=";
      for (let i = 0; i < filterInfo.code.length; i++) {
        if (filterInfo.code[i] == "Homicide") {
          updateUrl += "100,110,120,3100";
        } else if (filterInfo.code[i] == "Rape") {
          updateUrl += "210,220";
        } else if (filterInfo.code[i] == "Robbery") {
          updateUrl +=
            "300,311,312,313,314,321,322,323,324,331,332,333,344,351,352,353,354,361,363,364,372,373,374";
        } else if (filterInfo.code[i] == "Aggravated Assault") {
          updateUrl +=
            "400,410,411,412,420,421,422,430,431,432,440,441,442,450,451,452,453";
        } else if (filterInfo.code[i] == "Burglary") {
          updateUrl +=
            "500,510,511,513,515,516,520,521,523,525,526,530,531,533,535,536,540,541,543,545,546,550,551,553,555,556,560,561,563,565,566";
        } else if (filterInfo.code[i] == "Theft") {
          updateUrl +=
            "600,601,603,611,612,613,614,621,622,623,630,631,632,633,640,641,642,643,651,652,653,661,662,663,671,672,673,681,682,683,691,692,693";
        } else if (filterInfo.code[i] == "Auto Theft") {
          updateUrl += "700,710,711,712,720,721,722,730,731,732";
        } else if (filterInfo.code[i] == "Simple Assault") {
          updateUrl += "810,861,862,863,863";
        } else if (filterInfo.code[i] == "Arson") {
          updateUrl +=
            "900,901,903,905,911,913,915,921,922,923,925,931,933,941,942,951,961,971,972,975,981,982";
        } else if (filterInfo.code[i] == "Vandalism/Graffiti") {
          updateUrl += "1400,1401,1410,1415,1416,1420,1425,1426,1430,1435,1436";
        } else if (filterInfo.code[i] == "Narcotics") {
          updateUrl +=
            "1800,1810,1811,1812,1813,1814,1815,1820,1822,1823,1824,1825,1830,1835,1840,1841,1842,1843,1844,1845,1850,1855,1860,1865,1870,1880,1885";
        } else if (filterInfo.code[i] == "Discharge") {
          updateUrl += "2619";
        } else if (filterInfo.code[i] == "Proactive Police Visit") {
          updateUrl += "9954,9986";
        } else if (filterInfo.code[i] == "Community Engagement Event") {
          updateUrl += "9959";
        }
        if (i != filterInfo.code.length - 1) {
          updateUrl += ",";
        }
      }
    }
    if (filterInfo.neighborhood.length != 0) {
      if (updateUrl === crime_url.value + "/incidents") {
        updateUrl += "?neighborhood=";
      } else {
        updateUrl += "&neighborhood=";
      }
      for (let i = 0; i < filterInfo.neighborhood.length - 1; i++) {
        updateUrl += filterInfo.neighborhood[i] + ",";
      }
      updateUrl += filterInfo.neighborhood[filterInfo.neighborhood.length - 1];
    }
    if (filterInfo.sDate != null) {
      if (updateUrl === crime_url.value + "/incidents") {
        updateUrl += "?start_date=" + filterInfo.sDate;
      } else {
        updateUrl += "&start_date=" + filterInfo.sDate;
      }
    }
    if (filterInfo.eDate != null) {
      if (updateUrl === crime_url.value + "/incidents") {
        updateUrl += "?end_date=" + filterInfo.eDate;
      } else {
        updateUrl += "&end_date=" + filterInfo.eDate;
      }
    }
    if (filterInfo.limit != "") {
      if (updateUrl === crime_url.value + "/incidents") {
        updateUrl += "?limit=" + filterInfo.limit;
      } else {
        updateUrl += "&limit=" + filterInfo.limit;
      }
    }
    console.log(updateUrl);
    fetch(`${updateUrl}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        crimes.value = data;
        console.log(crimes.valueOf());
        for (let j = 0; j <= map.neighborhood_markers.length-1; j++) {
          map.neighborhood_markers[j].count = 0;
        }
        for (let i = 0; i <= data.length-1; i++) {
          map.neighborhood_markers[data[i].neighborhood_number - 1].count++;
        }
        drawMarkers();
      })
      .catch((error) => {
        console.error("Error fetching crimes:", error);
      });
    tableUpdateOnZoom.value += 1;
  }
}

function drawMarkers() {
  for (let i = 0; i < map.neighborhood_markers.length; i++) {
    let location = map.neighborhood_markers[i];
    if (location.marker === true) {
      map.leaflet.removeLayer(markers[i]);
      markers[i] = L.marker([location.location[0], location.location[1]])
        .addTo(map.leaflet)
        .bindPopup(
          location.name + " - Number of Crimes displayed: " + location.count
        );
    }
  }
}

function deleteIncident(caseNumber) {
  const apiUrl = crime_url.value + "/remove-incident";
  return fetch(`${apiUrl}?case_number=${caseNumber}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Error deleting incident: ${response.statusText}`);
      }
      return response.text();
    })
    .then((result) => {
      console.log(result);
      this.updateCrimes();
      alert(`Crime ${caseNumber} has been deleted`);
    })
    .catch((error) => {
      console.error("Error deleting incident:", error);
      throw error;
    });
}

// Function called when user presses 'OK' on dialog box
function closeDialog() {
  let dialog = document.getElementById("rest-dialog");
  let url_input = document.getElementById("dialog-url");
  if (crime_url.value !== "" && url_input.checkValidity()) {
    dialog_err.value = false;
    dialog.close();
    initializeCrimes();
  } else {
    dialog_err.value = true;
  }
}

// Function called when user presses 'Go' input box
function submitLocation(lat, lon, add) {
  /*
  // Send the coordinates to the REST API (replace with your actual API call)
  //fetch("/api/crimedata", {
    //method: "POST",
    //body: JSON.stringify({ coordinates }),
  //})
    //.then((response) => response.json())
    //.then((data) => {
      // Update map based on the received data (e.g., center on location, display markers)
      // ...

      //console.log("Location submitted successfully!");
    //})
    //.catch((error) => {
      //console.error("Error submitting location:", error);
    //});
    */
  // Query the Nominatim API based on input method
  let url = ``;
  if (showAddress.value === "on") {
    console.log("Address selected");
    add = add.replaceAll(" ", "+").trim();
    url = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${add}+Saint+Paul,+Minnesota`;
    console.log(url);
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        latitude.value = data[0].lat;
        longitude.value = data[0].lon;
        address.value = data[0].display_name;
        map.leaflet.setView([latitude.value, longitude.value]);
      })
      .catch((error) => {
        console.error("Error fetching address:", error);
      });
  } else {
    console.log("Coordinates selected");
    url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude.value}&lon=${longitude.value}`;
    console.log(url);
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        address.value = data.display_name;
        map.leaflet.setView([latitude.value, longitude.value]);
      })
      .catch((error) => {
        console.error("Error fetching coordinates:", error);
      });
  }
}

function onMap(index) {
  var indexLat = map.neighborhood_markers[index].location[1];
  var indexLon = map.neighborhood_markers[index].location[0];
  if (
    indexLat <= map.leaflet.getBounds().getEast() &&
    indexLat >= map.leaflet.getBounds().getWest() &&
    indexLon <= map.leaflet.getBounds().getNorth() &&
    indexLon >= map.leaflet.getBounds().getSouth()
  ) {
    return true;
  } else {
    return false;
  }
}

async function submitForm(event) {
  try {
    event.preventDefault(); // Prevent page refresh
    // Check if form filled out
    if (
      case_number._value.trim() === "" ||
      date._value.trim() === "" ||
      time._value.trim() === "" ||
      code._value.trim() === "" ||
      incident._value.trim() === "" ||
      police_grid._value.trim() === "" ||
      neighborhood_number._value.trim() === "" ||
      block._value.trim() === ""
    ) {
      console.log("Form fields not filled out");
      window.alert("Please fill out all form fields.");
      return;
    }
    const dateTimeString = `${date._value}T${time._value}:00`;
    const requestData = {
      case_number: case_number._value,
      date_time: dateTimeString,
      code: code._value,
      incident: incident._value,
      police_grid: police_grid._value,
      neighborhood_number: neighborhood_number._value,
      block: block._value,
    };
    console.log("Sending data to server:", requestData);
    const apiUrl = crime_url.value + "/new-incident";
    // Add delay
    setTimeout(async () => {
      try {
        // Make PUT request using fetch
        console.log("Fetch Request:", apiUrl, JSON.stringify(requestData));
        const response = await fetch(apiUrl, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        });
        console.log("Server response:", response);
        // Handle the response
        if (response.ok) {
          console.log("Incident added successfully");
          // Add window.alert for successful submission
          window.alert("Incident added successfully");
        } else {
          console.error("Failed to add incident:", response.statusText);
        }
      } catch (error) {
        console.error("Error:", error.message);
      }
    }, 2000);
  } catch (error) {
    console.error("Error:", error.message);
  }
}
</script>

<template>
  <div class="grid-container">
    <header
      class="grid-x grid-padding-x"
      style="background-color: #333333; padding: 1rem 0"
    >
      <div class="cell">
        <nav class="text-center" style="margin-top: 0.5rem">
          <ul class="menu">
            <li>
              <a
                href="/?"
                style="
                  color: #ffffff;
                  text-decoration: none;
                  padding: 0.5rem 1rem;
                  margin: 0 0.5rem;
                  border-radius: 5px;
                  background-color: #555555;
                "
                >St. Paul Crime Data</a
              >
            </li>
            <li>
              <a
                href="about.html"
                style="
                  color: #ffffff;
                  text-decoration: none;
                  padding: 0.5rem 1rem;
                  margin: 0 0.5rem;
                  border-radius: 5px;
                  background-color: #555555;
                "
                >About the Project</a
              >
            </li>
          </ul>
        </nav>
      </div>
    </header>
    <dialog id="rest-dialog" open>
      <h1 class="dialog-header">St. Paul Crime REST API</h1>
      <label class="dialog-label">URL: </label>
      <input
        id="dialog-url"
        class="dialog-input"
        type="url"
        v-model="crime_url"
        placeholder="http://localhost:8000"
      />
      <p class="dialog-error" v-if="dialog_err">Error: must enter valid URL</p>
      <br />
      <button class="button" type="button" @click="closeDialog">OK</button>
    </dialog>

    <div class="grid-x grid-padding-x">
      <div id="leafletmap" class="cell auto"></div>
    </div>
    <br />
    <div class="grid-x grid-padding-x">
      <div id="input-box" class="cell auto">
        <h2 style="text-align: center">Search</h2>
        <h2 class="dialog-header">Enter Location:</h2>
        <div class="grid-x"></div>
        <label for="show-address">Address:</label>
        <input
          type="radio"
          id="show-address"
          name="display-options"
          v-model="showAddress"
          value="on"
        />
        <br />
        <label for="show-coordinates">Coordinates:</label>
        <input
          type="radio"
          id="show-coordinates"
          name="display-options"
          v-model="showAddress"
          value="off"
        />
        <div v-show="showAddress === 'on'">
          <label>Street Address:</label>
          <input id="address" v-model="address" placeholder="Address" />
        </div>

        <div v-show="showAddress === 'off'">
          <label>Latitude:</label
          ><input id="lat" v-model="latitude" placeholder="44.955139" />
          <label>Longitude:</label
          ><input id="lng" v-model="longitude" placeholder="-93.102222" />
        </div>
        <br />
        <button
          class="button"
          v-on:click="
            submitLocation(
              latitude.valueOf(),
              longitude.valueOf(),
              address.valueOf()
            )
          "
        >
          Go
        </button>
        <br />
        <br />
        <b id="address">Here is the address:</b>
        <p>{{ address }}</p>
        <b id="coordinates">Here are the coordinates:</b>
        <p>{{ latitude }}, {{ longitude }}</p>
      </div>
    </div>
  </div>

  <br />

  <div class="grid-container">
    <div class="grid-x grid-padding-x">
      <div id="input-box" class="cell auto">
        <h2 style="text-align: center">Filters</h2>
        <table>
          <tr>
            <td>
              <table>
                <tr>
                  <th>Incident Type</th>
                </tr>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      id="0"
                      value="Homicide"
                      v-model="filterInfo.code"
                    />
                    <label for="0">{{ incidentTypes[0] }}</label>
                  </th>
                </tr>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      id="1"
                      value="Rape"
                      v-model="filterInfo.code"
                    />
                    <label for="1">{{ incidentTypes[1] }}</label>
                  </th>
                </tr>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      id="2"
                      value="Robbery"
                      v-model="filterInfo.code"
                    />
                    <label for="2">{{ incidentTypes[2] }}</label>
                  </th>
                </tr>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      id="3"
                      value="Aggravated Assault"
                      v-model="filterInfo.code"
                    />
                    <label for="3">{{ incidentTypes[3] }}</label>
                  </th>
                </tr>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      id="4"
                      value="Burglary"
                      v-model="filterInfo.code"
                    />
                    <label for="4">{{ incidentTypes[4] }}</label>
                  </th>
                </tr>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      id="5"
                      value="Theft"
                      v-model="filterInfo.code"
                    />
                    <label for="5">{{ incidentTypes[5] }}</label>
                  </th>
                </tr>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      id="6"
                      value="Auto Theft"
                      v-model="filterInfo.code"
                    />
                    <label for="6">{{ incidentTypes[6] }}</label>
                  </th>
                </tr>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      id="7"
                      value="Simple Assault"
                      v-model="filterInfo.code"
                    />
                    <label for="7">{{ incidentTypes[7] }}</label>
                  </th>
                </tr>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      id="8"
                      value="Arson"
                      v-model="filterInfo.code"
                    />
                    <label for="8">{{ incidentTypes[8] }}</label>
                  </th>
                </tr>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      id="9"
                      value="Vandalism/Graffiti"
                      v-model="filterInfo.code"
                    />
                    <label for="9">{{ incidentTypes[9] }}</label>
                  </th>
                </tr>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      id="10"
                      value="Narcotics"
                      v-model="filterInfo.code"
                    />
                    <label for="10">{{ incidentTypes[10] }}</label>
                  </th>
                </tr>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      id="11"
                      value="Discharge"
                      v-model="filterInfo.code"
                    />
                    <label for="11">{{ incidentTypes[11] }}</label>
                  </th>
                </tr>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      id="12"
                      value="Proactive Police Visit"
                      v-model="filterInfo.code"
                    />
                    <label for="12">{{ incidentTypes[12] }}</label>
                  </th>
                </tr>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      id="13"
                      value="Community Engagement Event"
                      v-model="filterInfo.code"
                    />
                    <label for="13">{{ incidentTypes[13] }}</label>
                  </th>
                </tr>
              </table>
            </td>
            <td>
              <table>
                <tr>
                  <th>Neighborhood Name</th>
                </tr>
                <!-- Couldn't get the v-for to work with the v-model -->
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      id="0"
                      value="1"
                      v-model="filterInfo.neighborhood"
                    />
                    <label for="0">{{ neighborhood_names[0] }}</label>
                  </th>
                </tr>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      id="1"
                      value="2"
                      v-model="filterInfo.neighborhood"
                    />
                    <label for="1">{{ neighborhood_names[1] }}</label>
                  </th>
                </tr>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      id="2"
                      value="3"
                      v-model="filterInfo.neighborhood"
                    />
                    <label for="2">{{ neighborhood_names[2] }}</label>
                  </th>
                </tr>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      id="3"
                      value="4"
                      v-model="filterInfo.neighborhood"
                    />
                    <label for="3">{{ neighborhood_names[3] }}</label>
                  </th>
                </tr>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      id="4"
                      value="5"
                      v-model="filterInfo.neighborhood"
                    />
                    <label for="4">{{ neighborhood_names[4] }}</label>
                  </th>
                </tr>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      id="5"
                      value="6"
                      v-model="filterInfo.neighborhood"
                    />
                    <label for="5">{{ neighborhood_names[5] }}</label>
                  </th>
                </tr>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      id="6"
                      value="7"
                      v-model="filterInfo.neighborhood"
                    />
                    <label for="6">{{ neighborhood_names[6] }}</label>
                  </th>
                </tr>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      id="7"
                      value="8"
                      v-model="filterInfo.neighborhood"
                    />
                    <label for="7">{{ neighborhood_names[7] }}</label>
                  </th>
                </tr>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      id="8"
                      value="9"
                      v-model="filterInfo.neighborhood"
                    />
                    <label for="8">{{ neighborhood_names[8] }}</label>
                  </th>
                </tr>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      id="9"
                      value="10"
                      v-model="filterInfo.neighborhood"
                    />
                    <label for="9">{{ neighborhood_names[9] }}</label>
                  </th>
                </tr>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      id="10"
                      value="11"
                      v-model="filterInfo.neighborhood"
                    />
                    <label for="10">{{ neighborhood_names[10] }}</label>
                  </th>
                </tr>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      id="11"
                      value="12"
                      v-model="filterInfo.neighborhood"
                    />
                    <label for="11">{{ neighborhood_names[11] }}</label>
                  </th>
                </tr>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      id="12"
                      value="13"
                      v-model="filterInfo.neighborhood"
                    />
                    <label for="12">{{ neighborhood_names[12] }}</label>
                  </th>
                </tr>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      id="13"
                      value="14"
                      v-model="filterInfo.neighborhood"
                    />
                    <label for="13">{{ neighborhood_names[13] }}</label>
                  </th>
                </tr>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      id="14"
                      value="15"
                      v-model="filterInfo.neighborhood"
                    />
                    <label for="14">{{ neighborhood_names[14] }}</label>
                  </th>
                </tr>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      id="15"
                      value="16"
                      v-model="filterInfo.neighborhood"
                    />
                    <label for="15">{{ neighborhood_names[15] }}</label>
                  </th>
                </tr>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      id="16"
                      value="17"
                      v-model="filterInfo.neighborhood"
                    />
                    <label for="16">{{ neighborhood_names[16] }}</label>
                  </th>
                </tr>
              </table>
            </td>
            <td>
              <table>
                <tr>
                  <th>Date Range</th>
                </tr>
                <tr>
                  <td>
                    Start Date: <input type="date" v-model="filterInfo.sDate" />
                  </td>
                </tr>
                <tr>
                  <td>
                    End Date: <input type="date" v-model="filterInfo.eDate" />
                  </td>
                </tr>
              </table>
            </td>
            <td>
              <table>
                <tr>
                  <th>Max Incidents</th>
                </tr>
                <tr>
                  <th>
                    <input
                      v-model="filterInfo.limit"
                      placeholder="Default: 1000"
                      style="margin: 0 auto; width: 10rem"
                    />
                  </th>
                </tr>
              </table>
            </td>
          </tr>
        </table>
        <div>
          <input
            type="button"
            value="Update"
            style="margin: 1rem"
            @click="updateCrimes()"
          />
        </div>
      </div>
    </div>
  </div>

  <br />
  <div class="grid-container">
    <div class="grid-x grid-padding-x">
      <div id="input-box" class="cell auto">
        <h2 style="text-align: center">Crimes</h2>
        <p>Legend: 
          <span style="background-color: red;">Violent Crimes, </span>
          <span style="background-color: lightgreen;">Property Crimes, </span>
          <span style="background-color: lightblue;">Other</span>
        </p>
        <table>
          <tr>
            <th>Neighborhood</th>
            <th>Crime</th>
            <th>Date</th>
            <th>Time</th>
          </tr>
          <br />
          <span :key="tableUpdateOnZoom"></span>
          <tr style="text-align: center" v-for="rows in crimes.valueOf()" :class="{'red': violent.includes(rows.incident),
          'green': property.includes(rows.incident),
          'blue': other.includes(rows.incident)}">
            <td v-if="onMap(rows.neighborhood_number - 1)">
              {{ neighborhood_names[rows.neighborhood_number - 1] }}
            </td>
            <td v-if="onMap(rows.neighborhood_number - 1)">
              {{ rows.incident }}
            </td>
            <td v-if="onMap(rows.neighborhood_number - 1)">{{ rows.date }}</td>
            <td v-if="onMap(rows.neighborhood_number - 1)">{{ rows.time }}</td>
            <td v-if="onMap(rows.neighborhood_number - 1)">
              <button class="button" @click="deleteIncident(rows.case_number)">
                delete
              </button>
            </td>
          </tr>
        </table>
      </div>
    </div>
  </div>
  <br />
  <div class="grid-container">
    <div class="grid-x grid-padding-x">
      <div id="input-box" class="cell auto">
        <form>
          <h2 style="text-align: center">Add New Incident</h2>
          <label for="case_number">Case Number:</label>
          <input type="text" id="case_number" v-model="case_number" />
          <label for="date">Date:</label>
          <input type="date" id="date" v-model="date" />
          <label for="time">Time:</label>
          <input type="time" id="time" v-model="time" />
          <label for="code">Code:</label>
          <input type="text" id="code" v-model="code" />
          <label for="incident">Incident:</label>
          <input type="text" id="incident" v-model="incident" />
          <label for="police_grid">Police Grid:</label>
          <input type="text" id="police_grid" v-model="police_grid" />
          <label for="neighborhood_number">Neighborhood Number:</label>
          <input
            type="text"
            id="neighborhood_number"
            v-model="neighborhood_number"
          />
          <label for="block">Address:</label>
          <input type="text" id="block" v-model="block" />
          <button class="button" @click="submitForm($event)">
            Add Incident
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<style>
#rest-dialog {
  width: 20rem;
  margin-top: 1rem;
  z-index: 1000;
}

#leafletmap {
  height: 500px;
}

#input-box {
  border-style: solid;
  border-color: royalblue;
}

.dialog-header {
  font-size: 1.2rem;
  font-weight: bold;
}

.dialog-label {
  font-size: 1rem;
}

.dialog-input {
  font-size: 1rem;
  width: 100%;
}

.dialog-error {
  font-size: 1rem;
  color: #d32323;
}

.clickable {
  cursor: pointer;
}

.red {
  background-color: red;
}

.green {
  background-color: lightgreen;
}

.blue {
  background-color: lightblue;
}
</style>
