import {Box} from "@material-ui/core";
import americanBoxImg from "../../assets/img/american.png";
import europeanBoxImg from "../../assets/img/european.png";
import React from "react";

const Pallet = ({ id, handleDragStart, handleDragEnd, className }) => {
    return (
        <Box
            id={id}
            draggable
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            className={className}

        >
            <img id={id} src={id === 'american' ? americanBoxImg : europeanBoxImg} width={40}/>
        </Box>
    );
};

export default Pallet;