import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserCRUD.css';

const UserCRUD = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: '', email: '' });
  const [editUser, setEditUser] = useState({ id: '', name: '', email: '' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const response = await axios.get('http://localhost:5000/api/users');
    setUsers(response.data);
  };

  const handleCreate = async () => {
    // Email validation using a regular expression
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
    // Check if name or email is empty or if the email is invalid
    if (!newUser.name || !newUser.email) {
      alert('Please fill in both the name and email fields');
      return; // Exit the function if fields are empty
    }
  
    if (!emailRegex.test(newUser.email)) {
      alert('Please enter a valid email address');
      return; // Exit the function if the email is invalid
    }
  
    try {
      await axios.post('http://localhost:5000/api/users', newUser);
      fetchUsers(); // Refresh the user list after creating the user
      setNewUser({ name: '', email: '' }); // Clear the form after creation
      alert('Data added successfully'); // Success message
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };
  

  const handleUpdate = async () => {
    // Check if name and email are not empty
    if (!editUser.name || !editUser.email) {
      alert('Please select data from you stored in DB and edit');
      return; // Exit the function if fields are empty
    }
  
    try {
      await axios.put(`http://localhost:5000/api/users/${editUser.id}`, editUser);
      fetchUsers(); // Refresh the user list after update
      setEditUser({ id: '', name: '', email: '' }); // Clear the edit form
      alert('Data Updated successfully'); // Updated message
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };
  
  const handleDelete = async (id) => {
    // Display confirmation prompt
    const confirmDelete = window.confirm('Are you sure you want to delete this data?');
    
    if (!confirmDelete) {
      return; // Exit if the user cancels the deletion
    }
  
    try {
      await axios.delete(`http://localhost:5000/api/users/${id}`);
      alert('Data deleted successfully'); // Success message after deletion
      fetchUsers(); // Refresh the user list after deletion
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };
  

  return (
    <div>
      <h1>CRUD Application</h1>

      {/* Create User */}
      <div>
        <input
          type="text"
          placeholder="Name"
          value={newUser.name}
          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
        />
        <button onClick={handleCreate}>Create</button>
      </div>

      {/* Update User */}
      <div>
        <input
          type="text"
          placeholder="Name"
          value={editUser.name}
          onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          value={editUser.email}
          onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
        />
        <button onClick={handleUpdate}>Update</button>
      </div>

      {/* User List */}
      <ul>
        {users.map((user) => (
          <li key={user._id}>
            {user.name} - {user.email}
            <button onClick={() => { setEditUser({ id: user._id, name: user.name, email: user.email }) }}>Edit</button>
            <button onClick={() => handleDelete(user._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserCRUD;
