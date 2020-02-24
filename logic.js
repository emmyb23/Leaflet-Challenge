// data source = https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_week.geojson

var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_week.geojson";

// create first layer
var layers = new L.LayerGroup();

// perform a get to the url
d3.json(queryUrl, function (geoJson) {
    L.geoJSON(geoJson.features, {
      style: function (geoJsonFeature) {
        return{
          color: 'firebrick',
          weight: 2
        }
      },
    }).addTo(layers);
})
// make earthquake latyer
var earthquakeData = new L.LayerGroup();
function markerSize(mag) {
  return mag * 2;
};

// function createFeatures(earthquakeData) {
    
//     function onEachFeature(feature, layer) {
//         layer.bindPopup("<h3>" + feature.properties.place +
//         "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
//     }
//     var earthquakes = L.geoJSON(earthquakeData, {
//         onEachFeature: onEachFeature
//     });

//     // createImageBitmap(earthquakes);
// }

d3.json(queryUrl, function (geoJson) {
  L.geoJSON(geoJson.features, {
    pointToLayer: function (geoJsonPoint, latlng) {
      return L.circleMarker(latlng, { radius:markerSize(geoJsonPoint.properties.mag) });
    },
    style: function(geoJsonFeature) {
      return {
        color: 'purple',
        weight: 0.4,
        fillColor: Color(geoJsonFeature.properties.mag),
        fillOpacity: 0.8
      }
    },
    onEachFeature: function(feature, layer) {
      layer.bindPopup("<h4 style='text-align:center;'>" + new Date(feature.properties.time) +
      "</h4> <hr> <h5 style='text-align:center;'>" + feature.properties.title + "</h5>");
      
    }
  }).addTo(earthquakeData);
    createMap(earthquakeData);
});

function Color(mag) {
  if (mag > 5) {
      return 'Maroon'
  } else if (mag > 4) {
      return 'Red'
  } else if (mag > 3) {
      return 'Pink'
  } else if (mag > 2) {
      return 'Orange'
  } else if (mag > 1) {
      return 'Yellow'
  } else {
      return 'Green'
  }
};

function createMap() {
    
  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });

  var satellite = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    id: 'mapbox.satellite',
    accessToken: API_KEY
  });

  var comic = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    id: 'mapbox.comic',
    accessToken: API_KEY
  });
  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap,
    "Satellite": satellite,
    "Comic": comic
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    "Earthquakes": earthquakeData,
    "Magnitudes": layers
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      46.22, -2.21
    ],
    zoom: 2,
    layers: [streetmap, earthquakeData]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  // var legend = L.control({ position: 'bottomright' });
  // legend.onAdd = function (Legend) {
  //     var div = L.DomUtil.create('div', 'info legend'),
  //         mag = [0, 1, 2, 3, 4, 5];

  //     div.innerHTML += "<h4 style='margin:5px'>Magnitude</h4>"
  //     for (var i = 0; i < mag.length; i++) {
  //         div.innerHTML +=
  //             '<i style="background:' + Color(mag[i] + 1)+ '"></i> ' 
  //             + mag[i] + (mag[i + 1] ? '&ndash;' 
  //             + mag[i + 1] + '<br>' : '+');
  //     }
  //     return div;
  // };

  // var legend = L.control({
  //   position: "bottomright"
  // });

  // legend.onAdd = function() {
  //   var div = L.DomUtil.create("div", "info legend");

  //   var Magnitudes = [0, 1, 2, 3, 4, 5];

  //   var colors = [
  //     "Maroon",
  //     "Red",
  //     "Pink",
  //     "Orange",
  //     "Yellow",
  //     "Green"
  //   ];


  //   for (var i = 0; i < Magnitudes.length; i++) {
  //     div.innerHTML += "<i style='background: " + colors[i] + "'></i> " +
  //       Magnitudes[i] + (Magnitudes[i + 1] ? "&ndash;" + Magnitudes[i + 1] + "<br>" : "+");
  //   }
  //   return div;
  // };
  // legend.addTo(myMap);


}