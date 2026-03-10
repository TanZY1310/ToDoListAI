import {useState} from 'react';
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
    const [due_date, setDue_date] = useState(0)

    const queryClient = useQueryClient();

    const createTask = async (title, description, priority, due_date) => {
        setError(null)
        setTitle(title)
        setDescription(description)
        setDue_date(due_date)
        try {
            const response = await axios.post(`${API_BASE_URL}/tasks/create`,
                {title: title, description: description, priority: priority, due_date: due_date});
            console.log(response)
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
            setTitle("");
        },
    });

    return (
        <div>
            <TaskInput onSubmit={mutation.mutate} />
            <TaskDisplay />
        </div>
    )
}

export default TaskCreate;