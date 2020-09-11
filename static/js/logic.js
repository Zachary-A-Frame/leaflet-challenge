// let url =
//      "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"

var map = L.map("map", {
     center: [36.7783, -119.4179],
     zoom: 5,
})

// Adding tile layer to the map
L.tileLayer(
     "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
          attribution: 'Map data &copy <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>',
          maxZoom: 18,
          id: "mapbox/streets-v11",
          tileSize: 512,
          zoomOffset: -1,
          accessToken: API_KEY,
     }
).addTo(map)

let link =
     "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Grab the data with d3
d3.json(link, function (data) {

     // This is going to pick our color for circlemarkers on our map. I chose if else statements instead of switch cases because I find them to be easier to read / understand, although I understand this is a point of contension for some programmers.

     let chooseColor = (mag) => {
          if (mag > 7.0) {
               return "red"
          } else if (mag > 5.0) {
               return "orange"
          } else if (mag > 3.5) {
               return "yellow"
          } else if (mag > 2.0) {
               return "green"
          } else {
               return "blue"
          }
     }



     L.geoJSON(data, {
          pointToLayer: function (feature, latlng) {
               return L.circleMarker(latlng)
          },
          style: function (feature) {
               return {
                    color: "white",
                    // Call the chooseColor function to decide which color to color our neighborhood (color based on borough)
                    fillColor: chooseColor(feature.properties.mag),
                    radius: (feature.properties.mag * 4),
                    fillOpacity: 0.5,
                    weight: 1.5,
               }
          },
          // Called on each feature
          onEachFeature: function (feature, layer) {
               // Set mouse events to change map styling
               layer.on({
                    mouseover: function (event) {
                         layer = event.target
                         layer.setStyle({
                              fillOpacity: 1.0
                         })
                    },
                    mouseout: function (event) {
                         layer = event.target
                         layer.setStyle({
                              fillOpacity: 0.5
                         })
                    },
               })
               // Giving each feature a pop-up with information pertinent to it
               layer.bindPopup(
                    "<h1>" +
                    feature.properties.place +
                    "</h1> <hr> <h2>" +
                    "magnitude" + feature.properties.mag +
                    "</h2>"
               )
          },
     }).addTo(map)

     let legend = L.control({
          position: "bottomleft"
     })

     legend.onAdd = () => {
          let div = L.DomUtil.create("div", "info legend")

          let grades = [0, 2, 3.5, 5, 7]
          let colors = [
               "blue",
               "green",
               "yellow",
               "red",
               "orange"
          ]
          for (i = 0; i < grades.length; i++) {
               div.innerHTML +=
                    "<i style='background: " +
                    colors[i] +
                    "'></i> " +
                    grades[i] +
                    (grades[i + 1] ? "&ndash" + grades[i + 1] + "<br>" : "+")
          }
          return div
     }

     legend.addTo(map)
})