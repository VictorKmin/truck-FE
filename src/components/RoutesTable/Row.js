import React, {useState} from 'react';
import {
    Box, Button,
    Collapse, Dialog, DialogActions, DialogTitle,
    IconButton,
    makeStyles,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography
} from "@material-ui/core";
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import { useHistory } from 'react-router-dom';
import {Routes} from "../../router/routerConfig";
import {ArrowRight, DeleteOutline} from "@material-ui/icons";
import {routesAPI} from "../../services/api";

const useRowStyles = makeStyles({
    root: {
        '& > *': {
            borderBottom: 'unset',
        },
    },
});

const Row = ({ route, setRoutes }) => {
    const {trackerExternalId, origin, destination, waypoints, _id} = route;

    const history = useHistory();

    const [isWaypointsOpen, setWaypointsOpen] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const classes = useRowStyles();

    const handleRowClick = () => {
        history.push(`${Routes.TRUCK_LOAD}/${_id}`);
    };

    const handleCloseDeleteModal = () => {
        setDeleteModalOpen(false);
    };


    const handleDeleteTrack = async () => {
        const res = await routesAPI.deleteById(_id).catch(err => {
            alert(err.message)
        });

        handleCloseDeleteModal();

        if (res?._id === _id) {
            setRoutes(routes => routes.filter(r => r._id !== _id));
            return;
        }

        alert('Route was not deleted!');

    };

    return (
        <>
            <Dialog
                open={isDeleteModalOpen}
                onClose={handleCloseDeleteModal}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">Do you want to delete?</DialogTitle>
                <DialogActions>
                    <Button onClick={handleCloseDeleteModal} color="primary" autoFocus>
                        No
                    </Button>
                    <Button onClick={handleDeleteTrack} color="secondary" >
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>

            <TableRow className={classes.root}>
                <TableCell>
                    <IconButton aria-label="expand row" size="small" onClick={() => setWaypointsOpen(!isWaypointsOpen)}>
                        {isWaypointsOpen ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
                    </IconButton>
                </TableCell>

                <TableCell component="th" scope="row">
                    {trackerExternalId}
                </TableCell>

                <TableCell component="th" scope="row">
                    {origin}
                </TableCell>

                <TableCell align="left">
                    {destination}
                </TableCell>

                <TableCell align="right">
                    <Button variant="outlined" color="primary" style={{textTransform: 'unset'}} onClick={handleRowClick}>
                        Open <ArrowRight/>
                    </Button>
                </TableCell>

                <TableCell>
                    <IconButton aria-label="expand row" size="small" onClick={() => setDeleteModalOpen(!isDeleteModalOpen)}>
                        <DeleteOutline color="secondary" />
                    </IconButton>
                </TableCell>
            </TableRow>

            <TableRow>
                <TableCell style={{paddingBottom: 0, paddingTop: 0}} colSpan={6}>
                    <Collapse in={isWaypointsOpen} timeout="auto" unmountOnExit>
                        <Box margin={1}>
                            <Typography variant="h6" gutterBottom component="div">
                                Waypoints
                            </Typography>
                            <Table size="small" aria-label="purchases">
                                <TableHead>
                                    <TableRow>
                                        <TableCell><b>Location</b></TableCell>
                                        <TableCell><b>Stopover</b></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {waypoints.map(({location, stopover}) => (
                                        <TableRow key={location}>
                                            <TableCell component="th" scope="row">
                                                {location}
                                            </TableCell>
                                            <TableCell>{stopover ? 'Yes' : 'No'}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
};

export default Row;