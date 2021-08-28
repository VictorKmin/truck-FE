import React, {useState} from 'react';
import Alert from "@material-ui/lab/Alert";
import {Box, Button, Checkbox, makeStyles, Typography} from "@material-ui/core";
import {routesAPI} from "../../services/api";
import CheckboxComponent from "./Checkbox";
import {ChevronRight} from "@material-ui/icons";

const useStyles = makeStyles({
    wrapper: {
        boxShadow: '2px 2px 8px #bcbcbc6b',
        borderRadius: 8,
        border: '1px solid #bcbcbc6b'
    }
});

const Form = ({onNewPoint}) => {
    const [errors, setErrors] = useState([]);

    const onClick = (e) => {
        e.preventDefault();
        const waypts = [];

        const waypoints = document.getElementsByClassName("waypoints");

        for (const inputElement of waypoints) {
            if (inputElement.value) {
                waypts.push({
                    location: inputElement.value
                });
            }
        }

        const newPoint = {
            trackerExternalId: document.getElementById('tracker-id').value,
            trailerWidth: document.getElementById('trailer-width').value,
            trailerLength: document.getElementById('trailer-length').value,
            origin: document.getElementById('start').value,
            destination: document.getElementById('end').value,
            waypoints: waypts,
            avoidFerries: document.getElementById('avoidFerries').checked,
            avoidTools: document.getElementById('avoidTools').checked,
            avoidHighways: document.getElementById('avoidHighways').checked
        };

        routesAPI.postNewRoute(newPoint).then(({data: {route}}) => {
            if (route) {
                onNewPoint(route);
                return;
            }

            setErrors(['New route was not added! Problem in the server side..'])
        });

    };

    const addWaypoint = (e) => {
        e.preventDefault();
        const input = document.createElement('input');
        window.google && new window.google.maps.places.SearchBox(input);

        input.setAttribute('class', 'waypoints');
        input.style.margin = '10px 0'
        const [w] = document.getElementsByClassName('waypoints-block__inputs');
        w.appendChild(input);
    };

    return (
        <>
            {errors.length ? errors.map(err => <Alert severity="error">{err}</Alert>) : ''}

            <form id="form" onSubmit={onClick} style={{zIndex: 30}}>
                <Box width='100%' borderBottom='1px solid lightgrey' p={1} bgcolor="#fafafa">
                    <Typography
                        variant='h6'
                        // color='textSecondary'
                        align='center'
                    >
                        Add new truck
                    </Typography>
                </Box>

                <Box px={2} py={2} display='flex' alignItems='center' flexDirection='column'>
                    <Box mb={2}>
                        <Box pb={1} display='flex' alignItems='center' justifyContent='space-between'>
                            <Box py={0.3} mr={1}>
                                <Typography variant="body1"><b>Tracker ID</b></Typography>
                            </Box>

                            <input
                                className="input"
                                id="tracker-id"
                                required={true}
                                type="number"
                            />
                        </Box>

                        <Box pb={1} display='flex' alignItems='center' justifyContent='space-between'>
                            <Box py={0.3} mr={1}>
                                <Typography variant="body2" color='textSecondary'>Trailer width</Typography>
                            </Box>

                            <input
                                max={4}
                                step={0.01}
                                className="input"
                                id="trailer-width"
                                required={true}
                                type="number"
                                placeholder="(m)"
                            />
                        </Box>

                        <Box pb={1} display='flex' alignItems='center'>
                            <Box py={0.3} mr={1}>
                                <Typography variant="body2" color='textSecondary'>Trailer length</Typography>
                            </Box>

                            <input
                                step={0.01}
                                max={15}
                                className="input"
                                id="trailer-length"
                                required={true}
                                type="number"
                                placeholder="(m)"
                            />
                        </Box>
                    </Box>

                    <Box pb={2}  display='flex' alignItems='center'>
                        <Box py={0.3} mr={1}>
                            <Typography
                                variant="body1"
                                color='textSecondary'>
                                Start point
                            </Typography>
                        </Box>

                        <input
                            className="input"
                            id="start"
                            required={true}
                            type="text"
                        />
                    </Box>

                    <Box
                        my={2}
                        pb={2}
                        display='flex'
                        flexDirection='column'
                        alignItems='center'
                        className="waypoints-block"
                    >
                        <Box >
                            <Typography variant='body1'><b>Waypoints</b></Typography>
                        </Box>
                        <Box my={1.3} className="waypoints-block__inputs">
                            <input className="waypoints" required={true} type="text"/>
                        </Box>

                        <Box pt={1}>
                            <Button onClick={addWaypoint} variant='outlined'>Add waypoint</Button>
                        </Box>
                    </Box>

                    <Box pb={2} mt={1.5}  display='flex' alignItems='center'>
                        <Box py={0.3} mr={1}>
                            <Typography
                                variant="body1"
                                color='textSecondary'>
                                End point
                            </Typography>
                        </Box>
                        <input id="end" className="input" required={true} />
                    </Box>

                    <Box mt={1} mb={3} width='100%' textAlign='center'>
                        <Typography variant='body1' color='textSecondary'>Avoid</Typography>
                        <Box
                            mt={1}
                            mx='auto'
                            display='flex'
                            flexWrap='wrap'
                            justifyContent='space-between'
                            width='inherit'
                            maxWidth='300px'
                        >
                            <CheckboxComponent
                                text="Ferries"
                                id="avoidFerries"
                                name="avoidFerries"
                            />
                            <CheckboxComponent
                                text="Tools"
                                id="avoidTools"
                                name="avoidTools"
                            />
                            <CheckboxComponent
                                text="Highways"
                                id="avoidHighways"
                                name="avoidHighways"
                            />
                        </Box>
                    </Box>

                    <Button
                        fullWidth
                        variant='outlined'
                        id="submit"
                        type="submit"
                    >
                        Send
                        <ChevronRight />
                    </Button>
                </Box>
            </form>
        </>
    );
};

export default Form;