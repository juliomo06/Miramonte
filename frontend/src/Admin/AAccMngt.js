import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const ModeratorManager = () => {
  const [moderators, setModerators] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchModerators();
  }, []);

  const fetchModerators = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/admin/moderators', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setModerators(response.data);
    } catch (err) {
      showAlert('Error fetching moderators', 'error');
    }
  };

  const createModerator = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/api/admin/moderators',
        { name, email, password },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      showAlert('Moderator created successfully', 'success');
      fetchModerators();
      setName('');
      setEmail('');
      setPassword('');
      setIsModalOpen(false);
    } catch (err) {
      showAlert('Error creating moderator', 'error');
    }
  };

  const deleteModerator = async (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:8080/api/admin/moderators/${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
          showAlert('Moderator deleted successfully', 'success');
          fetchModerators();
        } catch (err) {
          showAlert('Error deleting moderator', 'error');
        }
      }
    });
  };

  const showAlert = (message, type) => {
    Swal.fire({
      icon: type,
      title: message,
      showConfirmButton: false,
      timer: 1500
    });
  };

  return (
    <div className="moderator-manager p-6 bg-gray-100 min-h-screen">
      <div className='flex flex-row items-center'>
        <h2 className="text-2xl font-bold mb-4">Moderator Account Manager</h2>
        <button
          className="px-4 py-2 border-blue-500 border-2 rounded-md ml-4 mb-4"
          onClick={() => setIsModalOpen(true)}
        >
          Register New Moderator
        </button>
      </div>

      {isModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="text-lg font-bold">Register Moderator</h3>
            <form onSubmit={createModerator} className="space-y-4">
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input input-bordered w-full"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input input-bordered w-full"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input input-bordered w-full"
                required
              />
              <div className="modal-action">
                <button className="px-4 py-2 bg-green-500 rounded-lg" type="submit">Create Moderator</button>
                <button
                  type="button"
                  className="px-4 py-2 bg-blue-500 rounded-lg"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <h3 className="text-xl font-bold mt-6 mb-2">Moderators List</h3>
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {moderators.map((moderator) => (
              <tr key={moderator._id}>
                <td>{moderator.name}</td>
                <td>{moderator.email}</td>
                <td>
                  <button
                    className="bg-red-500 text-white rounded px-4 py-2 hover:bg-red-600"
                    onClick={() => deleteModerator(moderator._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ModeratorManager;
