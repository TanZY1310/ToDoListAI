import {useRef, useState} from 'react';
import axios from 'axios';
import TaskInput from './TaskInput';
import TaskDisplay from './TaskDisplay';
import {API_BASE_URL} from "../util.js";
import {useMutation, useQueryClient} from "@tanstack/react-query";

function TaskCreate() {
    const [task, setTask] = useState(null)
    const [error, setError] = useState(null)
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [priority, setPriority] = useState("")
    const [dueDate, setDueDate] = useState(new Date())

    const resetFormRef = useRef(null);

    const queryClient = useQueryClient();

    const createTask = async ({title, description, priority, dueDate}) => {
        setError(null)
        setTitle(title)
        setDescription(description)
        setPriority(priority)
        setDueDate(dueDate)

        try {
            const response = await axios.post(`${API_BASE_URL}/tasks/create`,
                {title: title, description: description, priority: priority, due_date: dueDate});
            console.log(response.data);
            setTask(response.data);
        } catch (e) {
            setError(`Failed to create task: ${e.message}`)
        }
    }

    const mutation = useMutation({
        mutationFn: createTask,
        onSuccess: () => {
            queryClient.invalidateQueries(["tasks"]);
            if (resetFormRef.current) resetFormRef.current(); //Reset field value after create task
        },
    });

    return (
        <div>
            <TaskInput onSubmit={mutation.mutate} onResetRef={resetFormRef} />
            <TaskDisplay />
        </div>
    )
}

export default TaskCreate;