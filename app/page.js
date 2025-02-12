"use client";
import { useState, useEffect } from "react";

// Main Home Component
export default function Home() {
  const [reminders, setReminders] = useState([]);
  const [newReminder, setNewReminder] = useState("");
  const [editId, setEditId] = useState(null);
  const [notification, setNotification] = useState("");

  // Load reminders from local storage on page load
  useEffect(() => {
    const storedReminders = JSON.parse(localStorage.getItem("reminders"));
    if (storedReminders) {
      setReminders(storedReminders);
    }
  }, []);

  // Save reminders to local storage whenever they change
  useEffect(() => {
    localStorage.setItem("reminders", JSON.stringify(reminders));
  }, [reminders]);

  // Function to add or edit a reminder
  const handleAddOrEdit = () => {
    if (newReminder.trim()) {
      if (editId) {
        // Edit existing reminder
        setReminders(
          reminders.map((reminder) =>
            reminder.id === editId ? { ...reminder, text: newReminder } : reminder
          )
        );
        setNotification("Reminder updated!");
        setEditId(null);
      } else {
        // Add new reminder
        setReminders([...reminders, { id: Date.now(), text: newReminder, completed: false }]);
        setNotification("Reminder added!");
      }
      setNewReminder("");
    }
  };

  // Function to delete a reminder
  const deleteReminder = (id) => {
    setReminders(reminders.filter((reminder) => reminder.id !== id));
    setNotification("Reminder deleted!");
  };

  // Function to mark a reminder as completed
  const toggleComplete = (id) => {
    setReminders(
      reminders.map((reminder) =>
        reminder.id === id ? { ...reminder, completed: !reminder.completed } : reminder
      )
    );
  };

  // Function to edit a reminder
  const handleEdit = (reminder) => {
    setNewReminder(reminder.text);
    setEditId(reminder.id);
  };

  // Clear the notification after 2 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(""), 2000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-8">
      <h1 className="text-3xl font-bold mb-6">Advanced Medication Reminder System</h1>

      {/* Notification */}
      {notification && (
        <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">{notification}</div>
      )}

      {/* Input field for adding or editing reminders */}
      <div className="flex space-x-2 mb-6 w-full max-w-md">
        <input
          type="text"
          placeholder="Enter a medication reminder"
          value={newReminder}
          onChange={(e) => setNewReminder(e.target.value)}
          className="flex-grow p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleAddOrEdit}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          {editId ? "Update" : "Add"}
        </button>
      </div>

      {/* Reminder list */}
      <ul className="w-full max-w-md space-y-2">
        {reminders.map((reminder) => (
          <li
            key={reminder.id}
            className={`p-4 border rounded-md bg-white flex justify-between items-center ${
              reminder.completed ? "bg-green-50" : ""
            }`}
          >
            <div>
              <span className={reminder.completed ? "line-through text-gray-500" : ""}>
                {reminder.text}
              </span>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => toggleComplete(reminder.id)}
                className="text-blue-500 hover:underline"
              >
                {reminder.completed ? "Mark Incomplete" : "Mark Complete"}
              </button>
              <button
                onClick={() => handleEdit(reminder)}
                className="text-yellow-500 hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => deleteReminder(reminder.id)}
                className="text-red-500 hover:underline"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
