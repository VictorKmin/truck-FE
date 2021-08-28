import React from 'react';

export const Marker = ({ point }) => {
    const { currentPosition } = point;
    console.log(currentPosition)

    if (currentPosition) {
        const marker = new window.google.maps.Marker({
            position: {
                lat: currentPosition.lat,
                lng: currentPosition.lng
            },
            title: "Hello World!",
        });
        marker.setMap(window.map);
    }

    return null;
}
