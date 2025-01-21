import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { removeTask, updateTaskWeather } from '../../store/slices/tasksSlice';
import { Trash2, Cloud } from 'lucide-react';
import axios from 'axios';

const TaskList: React.FC = () => {
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchWeather = async (taskId: string) => {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=London&appid=YOUR_API_KEY&units=metric`
        );
        dispatch(updateTaskWeather({
          id: taskId,
          weather: {
            temp: response.data.main.temp,
            description: response.data.weather[0].description,
            icon: response.data.weather[0].icon,
          },
        }));
      } catch (error) {
        console.error('Failed to fetch weather:', error);
      }
    };

    tasks.forEach(task => {
      if (!task.weather) {
        fetchWeather(task.id);
      }
    });
  }, [tasks, dispatch]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div
          key={task.id}
          className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center space-x-4">
            <span className={`px-2 py-1 rounded-full text-sm font-medium ${getPriorityColor(task.priority)}`}>
              {task.priority}
            </span>
            <span className="text-gray-900">{task.title}</span>
            {task.weather && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Cloud className="w-4 h-4" />
                <span>{Math.round(task.weather.temp)}°C</span>
                <span>{task.weather.description}</span>
              </div>
            )}
          </div>
          <button
            onClick={() => dispatch(removeTask(task.id))}
            className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      ))}
      {tasks.length === 0 && (
        <p className="text-center text-gray-500">No tasks yet. Add one above!</p>
      )}
    </div>
  );
};

export default TaskList;