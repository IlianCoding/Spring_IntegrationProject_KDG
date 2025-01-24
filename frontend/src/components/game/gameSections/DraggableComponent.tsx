import {useDrag} from 'react-dnd';
import React, {useState} from "react";
import {Box} from "@mui/material";
import CardType from "../../../model/enum/CardType.ts";

interface DraggableComponentProps {
    type: CardType;
    id: string;
    children: React.ReactNode;
}

function DraggableComponent({type, id, children}: DraggableComponentProps) {
    const [isReturning, setIsReturning] = useState(false);


    const [{isDragging}, drag, dragPreview] = useDrag(() => ({
        type,
        item: {id},
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
        end: (_item, monitor) => {
            if (!monitor.didDrop()) {
                setIsReturning(true);
                setTimeout(() => setIsReturning(false), 500);
            }
        },
    }));

    return (
        <Box
            ref={isDragging ? dragPreview : drag}
            className={isReturning ? 'returning' : ''}
        >
            {children}
        </Box>
    );
}

export default DraggableComponent;