import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
    const [todos, setTodos] = useState([]);
    const [newTask, setNewTask] = useState('');
    const [newDue, setNewDue] = useState('');
    const [newStatus, setNewStatus] = useState(false);

    useEffect(() => {
        axios.get('https://todo-production-c628.up.railway.app/')
            .then(response => {
                setTodos(response.data);
            })
            .catch(error => {
                console.error(error);
            });
    }, []);

    const handleAddTodo = () => {
        axios.post('https://todo-production-c628.up.railway.app/', {
            task: newTask,
            status: newStatus.toString(),
            due: newDue,
        })
            .then(response => {
                axios.get('https://todo-production-c628.up.railway.app/')
                    .then(response => {
                        setTodos(response.data);
                        setNewTask('');
                        setNewDue('');
                        setNewStatus(false);
                    })
                    .catch(error => {
                        console.error(error);
                    });
            })
            .catch(error => {
                console.error(error);
            });
    };

    const handleToggleStatus = (id, currentStatus) => {
        axios.put(`https://todo-production-c628.up.railway.app/${id}`, { status: !currentStatus })
            .then(response => {
                axios.get('https://todo-production-c628.up.railway.app/')
                    .then(response => {
                        setTodos(response.data);
                    })
                    .catch(error => {
                        console.error(error);
                    });
            })
            .catch(error => {
                console.error(error);
            });
    };

    const handleDeleteTodo = (id) => {
        axios.delete(`https://todo-production-c628.up.railway.app/${id}`)
            .then(response => {
                axios.get('https://todo-production-c628.up.railway.app/')
                    .then(response => {
                        setTodos(response.data);
                    })
                    .catch(error => {
                        console.error(error);
                    });
            })
            .catch(error => {
                console.error(error);
            });
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0]; // Format as yyyy-mm-dd
    };

    const sortedTodos = [...todos].sort((a, b) => b.status - a.status);

    return (
        <div className="flex justify-center items-center h-screen p-5">
            <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Todo List</h1>

                <div className="mb-6">
                    <input
                        type="text"
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        placeholder="Task name"
                        className="w-full p-3 mb-3 border border-gray-300 rounded-lg"
                    />
                    <input
                        type="date"
                        value={newDue}
                        onChange={(e) => setNewDue(e.target.value)}
                        className="w-full p-3 mb-3 border border-gray-300 rounded-lg"
                    />
                    <div className="flex items-center mb-5">
                        <input
                            type="checkbox"
                            checked={newStatus}
                            onChange={(e) => setNewStatus(e.target.checked)}
                            className="mr-3"
                        />
                        <label htmlFor="status" className="text-gray-700">
                            Mark as Done?
                        </label>
                    </div>
                    <button
                        onClick={handleAddTodo}
                        className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                        Add Todo
                    </button>
                </div>

                <ul className="space-y-4">
                    {sortedTodos.map(todo => (
                        <li key={todo.id} className={`bg-white p-4 rounded-lg shadow-md flex justify-between items-center ${todo.status === false ? 'bg-gray-100 text-gray-500' : 'bg-blue-100 text-blue-700'}`}>
                            <div className="flex-1">
                                <p className={`text-lg ${todo.status === false ? 'line-through' : ''}`}>{todo.task}</p>
                                <p className="text-sm text-gray-600">{formatDate(todo.due)}</p>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => handleToggleStatus(todo.id, todo.status === false)}
                                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                                >
                                    {todo.status === false ? 'Undone' : 'Done'}
                                </button>
                                <button
                                    onClick={() => handleDeleteTodo(todo.id)}
                                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default App;
