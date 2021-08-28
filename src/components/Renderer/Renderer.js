import React from 'react';

const Renderer = ({ point }) => {
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);
    const waypoints = point.waypoints.map(value => {
       delete value._id;
       return value;
    })

    const directionsService = new window.google.maps.DirectionsService();
    const directionsRenderer = new window.google.maps.DirectionsRenderer({
        polylineOptions: {
            strokeColor: '#' + randomColor
        }
    });
    directionsRenderer.setMap(window.map);

    directionsService.route(
        {
            origin: point.origin,
            destination: point.destination,
            waypoints: waypoints,
            optimizeWaypoints: true,
            avoidHighways: point.avoidHighways,
            avoidTolls: point.avoidTolls,
            avoidFerries: point.avoidFerries,
            travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (response, status) => {
            if (status === "OK" && response) {
                directionsRenderer.setDirections(response);
            } else {
                window.alert("Directions request failed due to " + status);
            }
        }
    );

    return null;
}

export default Renderer;
