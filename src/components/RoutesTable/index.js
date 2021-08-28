import React from 'react';
import {
    Box,
    makeStyles,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow, Typography
} from "@material-ui/core";
import Row from "./Row";
import {RoomOutlined, SettingsOutlined} from "@material-ui/icons";

const useStyles = makeStyles({
    table: {
        maxWidth: 600,
        maxHeight: 500,
        width: '100%'
    }
});

const RoutesTable = ({ routes, setRoutes }) => {
    const { table } = useStyles();

    return (
        <TableContainer className={table} component={Paper}>
            <Table stickyHeader aria-label="sticky table" >
                <TableHead>
                    <TableRow>
                        <TableCell>
                            <RoomOutlined/>
                        </TableCell>
                        <TableCell>
                            <Typography component="h2" >
                                <b>TrackerId</b>
                            </Typography>
                        </TableCell>
                        <TableCell align="left">
                            <Typography  component="h2">
                                <b>Origin</b>
                            </Typography>
                        </TableCell>
                        <TableCell align="left">
                            <Typography  component="h2">
                                <b>Destination</b>
                            </Typography>
                        </TableCell>
                        <TableCell>
                            <Typography  component="h2">
                                <b>Load</b>
                            </Typography>
                        </TableCell>
                        <TableCell>
                            <SettingsOutlined />
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {routes?.length ? (
                        routes.map((route) => (
                            <Row route={route} setRoutes={setRoutes}/>
                        ))
                    ): (
                        <TableRow>
                            <Box width='100%' p={3}>
                                <Typography variant="h5" align='center'>No routes</Typography>
                            </Box>
                        </TableRow>
                    )
                    }

                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default RoutesTable;