// script from mapBox 
// https://docs.mapbox.com/mapbox-gl-js/guides/install/#quickstart


mapboxgl.accessToken = mapToken;  // mapToken variable created in show.ejs page at the bottom
const map = new mapboxgl.Map({
container: "map", // container ID
style: "mapbox://styles/mapbox/streets-v11", // style URL
center: coolplace.geometry.coordinates, // starting position [lng, lat]
zoom: 10, // starting zoom
});

map.addControl(new mapboxgl.NavigationControl());
// add a pin

const el = document.createElement('div')
el.style.width = '10px'
el.style.height = '10px'
el.style.backgroundColor = '#111111'
el.style.borderRadius = '50%'


const marker1 = new mapboxgl.Marker(el)
    .setLngLat(coolplace.geometry.coordinates)
    .setPopup(new mapboxgl.Popup({offset: 25}).setHTML(
        `<h3>${coolplace.title}</h3><p>${coolplace.location}</p>`
        ))
    .addTo(map);


