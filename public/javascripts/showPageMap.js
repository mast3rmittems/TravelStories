mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v12',
    center: story.location.coordinates,
    zoom: 10,
});

map.addControl(new mapboxgl.NavigationControl());

new mapboxgl.Marker()
.setLngLat(story.location.coordinates)
.setPopup(
    new mapboxgl.Popup({offset: 25})
    .setHTML(
        `<h3>${story.title}</h3><p>${story.location}</p>`
    )
)
.addTo(map)

