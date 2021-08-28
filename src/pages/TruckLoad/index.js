import React, {useEffect, useState} from 'react';
import { useLocation } from 'react-router-dom';
import axios from "axios";

import Alert from '@material-ui/lab/Alert';
import {Box} from "@material-ui/core";
import TruckLoadPage from "./TruckLoadPage";

const TruckLoad = ({ id }) => {
    const [truck, setTruck] = useState(null);
    const [isLoading, setLoading] = useState(false);

    const fetchTruck = async () => {
        setLoading(true);

        const { data } = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/routes/${id}`);

        if (!data) {
            //alert error
        }

        setTruck(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchTruck();
    }, [])

    return isLoading
            ? <div>loading...</div>
            : truck
                ? <TruckLoadPage truck={truck} />
                :<Box width="1005" py={10}>
                    <Alert severity="error">Can`t load route with track id: { id }!</Alert>
                </Box>
};

export default TruckLoad;