
import { useState, useRef } from 'react';
import { Button, Input } from 'reactstrap'
import { useDrag, useDrop } from 'react-dnd';
import { ItemTypes } from './ItemTypes';

export default function Task({ id, text, clicked, index, moveTask, updateClick, updateText, deleteSelf }) {
    const ref = useRef(null);

    const updateContent = (newContent) => {

        updateText(id, newContent)
    }
    const edit = (e) => {
        // setClicked(newClick)
        // updateClick(id, newClick)
        console.log("edit")
    }
    const [{ handlerId }, drop] = useDrop({
        accept: ItemTypes.LIST_ITEM,
        collect(monitor) {
            return {
                handlerId: monitor.getHandlerId(),
            };
        },
        hover(item, monitor) {
            if (!ref.current) {
                return;
            }
            const dragIndex = item.index;
            const hoverIndex = index;
            // Don't replace items with themselves
            if (dragIndex === hoverIndex) {
                return;
            }
            // Determine rectangle on screen
            const hoverBoundingRect = ref.current?.getBoundingClientRect();
            // Get vertical middle
            const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
            // Determine mouse position
            const clientOffset = monitor.getClientOffset();
            // Get pixels to the top
            const hoverClientY = clientOffset.y - hoverBoundingRect.top;
            // Only perform the move when the mouse has crossed half of the items height
            // When dragging downwards, only move when the cursor is below 50%
            // When dragging upwards, only move when the cursor is above 50%
            // Dragging downwards
            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                return;
            }
            // Dragging upwards
            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
                return;
            }
            // Time to actually perform the action
            moveTask(dragIndex, hoverIndex);
            // Note: we're mutating the monitor item here!
            // Generally it's better to avoid mutations,
            // but it's good here for the sake of performance
            // to avoid expensive index searches.
            item.index = hoverIndex;
        },
    });
    const [{ isDragging }, drag] = useDrag({
        type: ItemTypes.LIST_ITEM,
        item: () => {
            return { id, index };
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });
    const opacity = isDragging ? 0 : 1;
    drag(drop(ref));
    return (
        <div ref={ref} style={{ opacity }} data-handler-id={handlerId} className="input-group" >
            <Button
                outline
                color="secondary"
                onClick={e => updateClick(id)}
            >
                {clicked ? <i className="bi bi-check-circle"></i> : <i className="bi bi-circle"></i>}
            </Button>
            <Input type="text" value={text} />
            <Button
                outline
                color="secondary"
                onClick={e => edit(id)}
            >
                <i className="bi bi-gear"></i>
            </Button>
            <Button
                outline
                color="secondary"
                onClick={e => deleteSelf(id)}
            >
                <i className="bi bi-trash"></i>
            </Button>
        </div>
    );
}