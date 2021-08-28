import React from 'react';
import {Switch, Route} from "react-router-dom";
import { Routes } from "./routerConfig";
import GoogleMap from "../pages/GoogleMap/GoogleMap";
import TruckLoad from "../pages/TruckLoad";

const Router = () => {
    return (
        <Switch>
            <Route exact path={Routes.HOME} component={GoogleMap}/>
            <Route exact path={`${Routes.TRUCK_LOAD}/:truckId`} render={(
                {
                    match: {
                        params: { truckId }
                    }
                }
            ) => <TruckLoad id={truckId} />}/>
        </Switch>
    );
};

export default Router;