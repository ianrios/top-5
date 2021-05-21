import Task from './Task'
import Modal from './Modal'
import { useState, useCallback } from 'react';
import update from 'immutability-helper';
import { Container, Row, Col, Button, Input } from "reactstrap"
import { v4 as uuidv4 } from 'uuid';

export default function List() {
    const [tasks, setTasks] = useState([])
    const moveTask = useCallback((dragIndex, hoverIndex) => {
        const dragTask = tasks[dragIndex];
        setTasks(update(tasks, {
            $splice: [
                [dragIndex, 1],
                [hoverIndex, 0, dragTask],
            ],
        }))
    }, [tasks])
    const renderTask = (task, index) => {
        return (
            <Task
                key={task.id}
                index={index}
                id={task.id}
                text={task.text}
                clicked={task.clicked}
                updateClick={updateClick}
                updateText={updateText}
                deleteSelf={deleteItem}
                moveTask={moveTask}
            />)
    }
    const [modal, setModal] = useState(false);

    const toggle = () => setModal(!modal);
    const [newTask, setNewTask] = useState("")
    const addNewTask = () => {
        // toggle()
        if (newTask.length) {
            setTasks(prevTasks => prevTasks.concat(
                {
                    id: uuidv4(),
                    text: newTask,
                    clicked: false,
                    reoccurring: false
                }))
            setNewTask("")
        }
    }
    const deleteItem = (id) => {
        console.log("delete", id)
        // pop up modal for reoccuring tasks confirming
        setTasks(prevTasks => prevTasks.filter(item => item.id !== id))
    }
    const updateText = (item) => {
        console.log("update", item)
    }
    const updateClick = (id) => {
        setTasks(prevTasks => prevTasks.map(item => {
            if (item.id === id) {
                item.clicked = !item.clicked
            }
            return item
        }))
    }
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            addNewTask()
        }
    }
    return (
        <Container>
            <Row>
                <Col className="col-10 offset-1">
                    <h1>Top 5</h1>
                </Col>
            </Row>
            <Row>
                <Col className="col-10 offset-1">

                    <div className='input-group'>
                        <Input
                            placeholder="new task"
                            type="text"
                            onChange={e => setNewTask(e.target.value)}
                            onKeyDown={handleKeyDown}
                            defaultValue={newTask}
                            value={newTask}
                        />
                        <Button
                            outline
                            color="secondary"
                            onClick={e => addNewTask()}
                        >
                            <i class="bi bi-plus"></i>
                        </Button>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col className="col-10 offset-1">
                    <ul className="list-group list-group-flush">
                        {tasks.map((task, idx) => renderTask(task, idx))}
                    </ul>
                </Col>
            </Row>
            <Modal toggle={toggle} modal={modal} />
        </Container>
    )
}

