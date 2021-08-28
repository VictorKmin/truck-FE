import React, {useEffect, useState, useRef} from 'react';
import Renderer from '../../components/Renderer/Renderer';
import axios from 'axios';
import {Marker} from "../../components/Marker/Marker";
import socket from '../../socket';
import "./style.css";
import {Box} from "@material-ui/core";
import Form from "../../components/Form";
import RoutesTable from "../../components/RoutesTable";
import {routesAPI} from "../../services/api";

const GoogleMap = () => {
    const googleMapRef = useRef();

    const [points, setPoints] = useState([]);
    const [isMapLoaded, setIsMapLoaded] = useState(false);

    useEffect(() => {
        const googleMapScript = document.createElement("script");
        googleMapScript.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_KEY}&libraries=places`;
        googleMapScript.async = true;

        window.document.body.appendChild(googleMapScript);

        googleMapScript.addEventListener("load", () => {
            createGoogleMap();
        });

        routesAPI.getAll().then(routes => setPoints(routes));
        socket.on('emit', data => {
            createGoogleMap();
            console.log('dataaaa:', data)
            setPoints(data);
        });
    }, []);

    window.onmousedown = null;
    window.onmousemove = null;
    window.onmouseup = null;

    const createGoogleMap = () => {
        window.map = new window.google.maps.Map(googleMapRef.current, {
            zoom: 8,
            center: {
                lat: 49.842957,
                lng: 24.031111
            }
        });
        setIsMapLoaded(true);
        const input1 = document.getElementById("start");
        const [input2] = document.getElementsByClassName("waypoints");
        const input3 = document.getElementById("end");
        console.log(input1)
        new window.google.maps.places.SearchBox(input1);
        new window.google.maps.places.SearchBox(input2);
        new window.google.maps.places.SearchBox(input3);
        // window.map.addListener("bounds_changed", () => {
        //     searchBox.setBounds(window.map.getBounds());
        // });
    };

    return (
        <>
            <div
                id="google-map"
                ref={googleMapRef}
                style={{ width: "100%", height: "100vh" }}
            />
            <Box
                my={5}
                display="flex"
                alignItems="flex-start"
                justifyContent="space-around"
                flexWrap="wrap"
            >
                <Form  onNewPoint={(newPoint) => setPoints([...points, newPoint])}/>
                <RoutesTable routes={points} setRoutes={setPoints}/>
            </Box>

            {
                (
                    points.length && isMapLoaded
                ) &&
                points.map((value, index) => {
                    return (
                        <>
                            <Renderer key={index} point={value}/>
                            <Marker key={Date.now()} point={value}/>
                        </>
                    )
                })
            }
        </>
    );
};

export default GoogleMap;
