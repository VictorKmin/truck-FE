import React, {useEffect, useRef, useState} from 'react';
import {Box, Button, makeStyles, Modal, Snackbar, Typography} from "@material-ui/core";

import Pallet from "./Pallet";

import {CPallet} from "./ClassPallet";
import {routesAPI} from "../../services/api";
import {Alert} from "@material-ui/lab";

const useStyles = makeStyles({
    carBox: {
        maxWidth: props => (props.width * 100) + 20,
    },
    trailer: {
        borderRadius: '10px 10px 0 0',
        height:  props => (props.height * 100) + 30,
        width: '100%',
        border: '10px solid #d5d6db',
        borderBottom: '20px solid #d5d6db',
        boxSizing: 'border-box',
        marginBottom: -20,
    },
    startBoxes: {
        marginRight: '30px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'

    },
    pallet: {
        cursor: 'pointer',
        '& img': {
            width: '50px',
            height: '50px',
            boxShadow: '1px 3px 4px 1px #80808047',
            borderRadius: '8px'
        }
    },
});

const TruckLoadPage = ({truck}) => {
    const {carBox, trailer, startBoxes, pallet} = useStyles({
        width: truck.trailerWidth,
        height: truck.trailerLength,
    });

    const [isDeleteOpen, setDeleteOpen] = useState(false);
    const [tempPallete, setTempPallete] = useState(null);
    const [isSnackBarOpen, setSnackBarOpen] = useState(false);

    const [pallets, setPallets] = useState(truck.pallets || []);

    const canvasRef = useRef();
    const draggblePalletRef = useRef();
    const cornersRef = useRef({
        dragTL: false,
        dragTR: false,
        dragBL: false,
        dragBR: false
    });

    const isCursorInPallet = (rect, ev) => {
        const {offsetLeft, offsetTop} = canvasRef?.current;

        return ev.pageX > rect.x + offsetLeft &&
            ev.pageX < rect.x + rect.width + offsetLeft &&
            ev.pageY > rect.y + offsetTop &&
            ev.pageY < rect.y + rect.height + offsetTop;
    };

    window.onmousedown = onMouseDown;
    window.onmousemove = onMouseMove;
    window.onmouseup = onMouseUp;
    document.addEventListener("dragover", function (event) {
        event.preventDefault();
    }, false);

    useEffect(() => {

        return () => {
            window.removeEventListener('mousedown', onMouseDown);
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
        }
    }, [])

    function onMouseMove(ev) {
        if (draggblePalletRef.current) {
            const {offsetLeft, offsetTop} = canvasRef.current;
            const mouseX = ev.pageX - offsetLeft;
            const mouseY = ev.pageY - offsetTop;

            setPallets(pallets => pallets.map((pallet) => {
                if (draggblePalletRef.current === pallet) {

                    if (cornersRef.current?.dragTL) {
                        const width = pallet.width + pallet.x - mouseX;

                        width < 0 ?
                            pallet.width = 20 :
                            pallet.width = pallet.width + pallet.x - mouseX;

                        const height = pallet.height + pallet.y - mouseY;

                        height < 0 ?
                            pallet.height = 20 :
                            pallet.height = pallet.height + pallet.y - mouseY;

                        pallet.x = mouseX;
                        pallet.y = mouseY;

                    } else if (cornersRef.current?.dragTR) {
                        pallet.width = Math.abs(pallet.x - mouseX);

                        const height = pallet.height + pallet.y - mouseY;

                        height < 0 ?
                            pallet.height = 20 :
                            pallet.height = pallet.height + pallet.y - mouseY;
                        pallet.y = mouseY;

                    } else if (cornersRef.current?.dragBL) {
                        const width = pallet.width + pallet.x - mouseX;

                        width < 0 ?
                            pallet.width = 20 :
                            pallet.width = pallet.width + pallet.x - mouseX;

                        pallet.x = mouseX;
                        pallet.height = Math.abs(pallet.y - mouseY);

                    } else if (cornersRef.current?.dragBR) {
                        pallet.width = Math.abs(pallet.x - mouseX);
                        pallet.height = Math.abs(pallet.y - mouseY);
                    } else {
                        pallet.x = ev.pageX - (pallet.width / 2) - offsetLeft;
                        pallet.y = ev.pageY - (pallet.height / 2) - offsetTop;
                    }
                }
                return pallet;
            }));

        }
    }

    function checkCloseEnough(p1, p2) {
        return Math.abs(p1 - p2) < 13;
    }

    function onMouseDown(ev) {
        pallets.forEach(pallete => {

            if (isCursorInPallet(pallete, ev)) {
                const {offsetLeft, offsetTop} = canvasRef?.current;
                const mouseX = ev.pageX - offsetLeft;
                const mouseY = ev.pageY - offsetTop;
                // 1. top left
                if (
                    checkCloseEnough(mouseX, pallete.x) &&
                    checkCloseEnough(mouseY, pallete.y)
                ) {
                    cornersRef.current.dragTL = true
                }
                // 2. top right
                else if (
                    checkCloseEnough(mouseX, pallete.x + pallete.width) &&
                    checkCloseEnough(mouseY, pallete.y)
                ) {
                    cornersRef.current.dragTR = true
                }
                // 3. bottom left
                else if (
                    checkCloseEnough(mouseX, pallete.x) &&
                    checkCloseEnough(mouseY, pallete.y + pallete.height)
                ) {
                    cornersRef.current.dragBL = true
                }
                // 4. bottom right
                else if (
                    checkCloseEnough(mouseX, pallete.x + pallete.width) &&
                    checkCloseEnough(mouseY, pallete.y + pallete.height)
                ) {
                    cornersRef.current.dragBR = true
                }

                draggblePalletRef.current = pallete;
            }
        })
    }

    function onMouseUp(ev) {
        if (draggblePalletRef.current) {
            if (
                draggblePalletRef.current.x > canvasRef.current.width ||
                draggblePalletRef.current.x < 0 ||
                draggblePalletRef.current.y > canvasRef.current.height ||
                draggblePalletRef.current.y < 0
            ) {
                setTempPallete(draggblePalletRef.current);
                setDeleteOpen(true);
            }

            cornersRef.current.dragTL = false;
            cornersRef.current.dragTR = false;
            cornersRef.current.dragBL = false;
            cornersRef.current.dragBR = false;

            draggblePalletRef.current = null;
        }

    }

    useEffect(() => {
        if (!pallets.length) return;

        const ctx = canvasRef.current.getContext('2d');
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

        if (pallets[0] instanceof CPallet) {
            pallets.forEach(pallete => pallete.draw(ctx));
            return;
        }

        setPallets(pallets.map(({x, y, width, height, type}) =>
            new CPallet(x, y, width, height, type)));
    }, [pallets])

    const handleNotDelete = () => {
        setPallets(pallets.map(pallete => {
            if (pallete === tempPallete) {
                pallete.x = 0;
                pallete.y = 0;
            }

            return pallete;
        }));

        draggblePalletRef.current = tempPallete;
        setDeleteOpen(false);
    };

    const handleDelete = () => {
        setPallets(pallets.filter(p => p !== tempPallete));
        setDeleteOpen(false);
        draggblePalletRef.current = null;
    };

    const draggableNewBox = useRef();

    const handleDrop = (ev) => {
        const {offsetLeft, offsetTop} = canvasRef.current;

        setPallets([...pallets, new CPallet(
            ev.pageX - 20 - offsetLeft, ev.pageY - 20 - offsetTop, 40, 40, draggableNewBox.current.id
        )])
    };

    const handleDragStart = (e) => {
        draggableNewBox.current = e.target;
    };
    const handleDragEnd = (e) => {
        draggableNewBox.current = null;
    };

    const handleCloseSnackBar = () => {
        setSnackBarOpen(false)
    };

    const handleSavePallets = async () => {
        if (pallets.length) {
            const data = await routesAPI.setPallets(truck._id, pallets);

            if (!data.route){
                alert('Not saved... !'); return;
            }

            setSnackBarOpen(true);
        }
    };

    useEffect(() => {
        document.addEventListener("dragover", function (event) {
            event.preventDefault();
        }, false);

    }, [])

    return (
        <>
            <Modal open={isDeleteOpen} style={{display: 'flex', alignItems: 'center'}}>
                <Box
                    m="auto"
                    p={5}
                    width='400px'
                    bgcolor="white"
                    borderRadius="10px"
                    style={{outline: 'none'}}
                    textAlign='center'
                >
                    <Box mb={2}><Typography>Do you want to delete the pallet?</Typography></Box>
                    <Box display="flex" justifyContent="center">
                        <Box mr={3}>
                            <Button variant="contained" color="primary" onClick={handleNotDelete}>No</Button>
                        </Box>
                        <Button variant="contained" color="secondary" onClick={handleDelete}>Delete</Button>
                    </Box>
                </Box>
            </Modal>

            <Snackbar
                open={isSnackBarOpen}
                autoHideDuration={6000}
                onClose={handleCloseSnackBar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackBar} severity="success">
                    Pallets was success saved!
                </Alert>
            </Snackbar>

            <Box width="100%" display="flex" justifyContent="center" flexWrap="wrap" py={3}>

                <Box className={startBoxes} mt={3}>
                    <Pallet id="american" className={pallet} handleDragStart={handleDragStart}
                            handleDragEnd={handleDragEnd}/>
                    <Box py={1}/>
                    <Pallet id="european" className={pallet} handleDragStart={handleDragStart}
                            handleDragEnd={handleDragEnd}/>

                    <Box mt={2}>
                        <Button
                            variant="outlined"
                            color='secondary'
                            onClick={handleSavePallets}
                            disabled={!pallets.length}
                        >
                            Save
                        </Button>
                    </Box>
                </Box>

                <Box className={carBox}>
                    <Box className={trailer} onDrop={handleDrop}>
                        <canvas  ref={canvasRef} width={truck.trailerWidth * 100} height={truck.trailerLength * 100} style={{border: '1px solid'}}/>
                    </Box>
                    {/*<Truck/>*/}
                </Box>
            </Box>
        </>
    );
};

export default TruckLoadPage;