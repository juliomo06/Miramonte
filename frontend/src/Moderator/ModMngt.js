import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ModMngt = () => {
  const [resortData, setResortData] = useState({
    name: '',
    pax: '',
    priceMin: '',
    priceMax: '',
    details: '',
    evfilter: []
  });
  const [images, setImages] = useState({
    image: null,
    image2: null,
    image3: null,
    image4: null,
    image5: null,
  });
  const [imagePreviews, setImagePreviews] = useState({});
  const [resorts, setResorts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingResort, setEditingResort] = useState(null);

  const isFormValid = resortData.name && resortData.pax && resortData.priceMin && resortData.priceMax && resortData.details && resortData.evfilter.length > 0 && Object.values(images).every((img) => img);

  useEffect(() => {
    fetchResorts();
  }, []);

  const fetchResorts = async () => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8080/api/resorts', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data && Array.isArray(response.data.resorts)) {
        const filteredResorts = response.data.resorts.filter(resort => resort.moderatorId.toString() === userId);
        setResorts(filteredResorts);
      }
    } catch (error) {
      console.error('Error fetching resorts:', error);
      setError('Failed to fetch resorts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "evfilter") {
      setResortData((prevState) => {
        const newEvfilter = prevState.evfilter.includes(value)
          ? prevState.evfilter.filter((evfilter) => evfilter !== value)
          : [...prevState.evfilter, value];
        return { ...prevState, evfilter: newEvfilter };
      });
    } else {
      if (editingResort) {
        setEditingResort({ ...editingResort, [name]: value });
      } else {
        setResortData({ ...resortData, [name]: value });
      }
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 15 * 1024 * 1024) {
        alert('File size exceeds 15MB');
        return;
      }
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        alert('Only JPG and PNG files are allowed');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews({ ...imagePreviews, [e.target.name]: reader.result });
      };
      reader.readAsDataURL(file);
    }
    setImages({ ...images, [e.target.name]: file });
  };

  const resetForm = () => {
    setResortData({
      name: '',
      pax: '',
      priceMin: '',
      priceMax: '',
      details: '',
      evfilter: [] // Reset events
    });
    setImages({
      image: null,
      image2: null,
      image3: null,
      image4: null,
      image5: null,
    });
    setImagePreviews({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    const token = localStorage.getItem('token');
    const moderatorId = localStorage.getItem('userId');
  
    const formData = new FormData();
    formData.append('name', resortData.name);
    formData.append('pax', resortData.pax);
    formData.append('priceMin', resortData.priceMin);
    formData.append('priceMax', resortData.priceMax);
    formData.append('details', resortData.details);
    formData.append('evfilter', JSON.stringify(resortData.evfilter));
    formData.append('moderatorId', moderatorId);
  
    Object.keys(images).forEach((key) => {
      if (images[key]) formData.append(key, images[key]);
    });
  
    try {
      await axios.post('http://localhost:8080/api/uploads', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
  
      await fetchResorts();
      resetForm();
    } catch (error) {
      console.error('Error uploading resort:', error);
      setError('Failed to upload resort. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (resort) => {
    setEditingResort(resort);
  };

  const handleUpdate = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');

    try {
      await axios.put(`http://localhost:8080/api/resorts/${editingResort._id}`, editingResort, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await fetchResorts();
      setEditingResort(null);
    } catch (error) {
      console.error('Error updating resort:', error);
      setError('Failed to update resort. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderResortDetails = (resort) => (
    <>
      <h3 className="text-xl font-semibold">{resort.name}</h3>
      <p><strong>Pax:</strong> {resort.pax}</p>
      <p><strong>Price Range:</strong> ${resort.priceMin} - ${resort.priceMax}</p>
      <p><strong>Details:</strong> {resort.details}</p>
      <p><strong>Events:</strong> {resort.evfilter.join(', ')}</p>
      <div className="flex space-x-2 mt-2">
        {resort.images && resort.images.map((img, index) => (
          <img 
            key={index} 
            src={`http://localhost:8080${img.path}`} 
            alt={`Resort Image ${index + 1}`} 
            className="w-16 h-16 object-cover rounded-lg shadow-md" 
          />
        ))}
      </div>
      <button
        onClick={() => handleEdit(resort)}
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Edit
      </button>
    </>
  );

  const renderEditingForm = () => (
    <div className="space-y-4">
      <input
        type="text"
        name="name"
        value={editingResort.name}
        onChange={handleInputChange}
        className="w-full px-3 py-2 border rounded"
        placeholder="Resort Name"
      />
      <input
        type="number"
        name="pax"
        value={editingResort.pax}
        onChange={handleInputChange}
        className="w-full px-3 py-2 border rounded"
        placeholder="Pax"
      />
      <input
        type="number"
        name="priceMin"
        value={editingResort.priceMin}
        onChange={handleInputChange}
        className="w-full px-3 py-2 border rounded"
        placeholder="Min Price"
      />
      <input
        type="number"
        name="priceMax"
        value={editingResort.priceMax}
        onChange={handleInputChange}
        className="w-full px-3 py-2 border rounded"
        placeholder="Max Price"
      />
      <textarea
        name="details"
        value={editingResort.details}
        onChange={handleInputChange}
        className="w-full px-3 py-2 border rounded"
        placeholder="Details"
      />
      <div className="space-y-2">
        <label>
          <input
            type="checkbox"
            value="Wedding"
            checked={editingResort.evfilter.includes('Wedding')}
            onChange={handleInputChange}
            name="evfilter"
            className="mr-2"
          />
          Wedding
        </label>
        <label>
          <input
            type="checkbox"
            value="Birthday"
            checked={editingResort.evfilter.includes('Birthday')}
            onChange={handleInputChange}
            name="evfilter"
            className="mr-2"
          />
          Birthday
        </label>
        <label>
          <input
            type="checkbox"
            value="Corporate Event"
            checked={editingResort.evfilter.includes('Corporate Event')}
            onChange={handleInputChange}
            name="evfilter"
            className="mr-2"
          />
          Corporate Event
        </label>
        <label>
          <input
            type="checkbox"
            value="Other"
            checked={editingResort.evfilter.includes('Other')}
            onChange={handleInputChange}
            name="evfilter"
            className="mr-2"
          />
          Other
        </label>
      </div>
      <div className="flex justify-center gap-4">
        {Object.keys(images).map((key) => (
          <div key={key}>
            <input
              type="file"
              name={key}
              onChange={handleFileChange}
              className="hidden"
              id={key}
            />
            <label htmlFor={key} className="cursor-pointer">
              <div className="w-20 h-20 border-2 border-gray-300 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 transition">
                {imagePreviews[key] ? (
                  <img src={imagePreviews[key]} alt="" className="w-full h-full object-cover rounded-lg" />
                ) : (
                  '+'
                )}
              </div>
            </label>
          </div>
        ))}
      </div>
      <button
        onClick={handleUpdate}
        disabled={loading || !isFormValid}
        className={`w-full py-3 px-6 rounded-lg text-lg font-semibold transition duration-200 ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-700'} focus:outline-none focus:ring-4 focus:ring-indigo-300`}
      >
        {loading ? 'Updating...' : 'Update Resort'}
      </button>
      <button
        onClick={() => setEditingResort(null)}
        className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
      >
        Cancel
      </button>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-8 bg-gray-50 shadow-lg rounded-xl">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Moderator Dashboard</h1>
      {error && <p className="text-red-500">{error}</p>}
      {loading && <p className="text-blue-500">Loading...</p>}
      
      {resorts.length === 0 ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            name="name"
            value={resortData.name}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="Resort Name"
          />
          <input
            type="number"
            name="pax"
            value={resortData.pax}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="Pax"
          />
          <input
            type="number"
            name="priceMin"
            value={resortData.priceMin}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="Min Price"
          />
          <input
            type="number"
            name="priceMax"
            value={resortData.priceMax}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="Max Price"
          />
          <textarea
            name="details"
            value={resortData.details}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="Details"
          />
          <div className="space-y-2">
            <label>
              <input
                type="checkbox"
                value="Wedding"
                checked={resortData.evfilter.includes('Wedding')}
                onChange={handleInputChange}
                name="evfilter"
                className="mr-2"
              />
              Wedding
            </label>
            <label>
              <input
                type="checkbox"
                value="Birthday"
                checked={resortData.evfilter.includes('Birthday')}
                onChange={handleInputChange}
                name="evfilter"
                className="mr-2"
              />
              Birthday
            </label>
            <label>
              <input
                type="checkbox"
                value="Corporate Event"
                checked={resortData.evfilter.includes('Corporate Event')}
                onChange={handleInputChange}
                name="evfilter"
                className="mr-2"
              />
              Corporate Event
            </label>
            <label>
              <input
                type="checkbox"
                value="Other"
                checked={resortData.evfilter.includes('Other')}
                onChange={handleInputChange}
                name="evfilter"
                className="mr-2"
              />
              Other
            </label>
          </div>
          <div className="flex justify-center gap-4">
            {Object.keys(images).map((key) => (
              <div key={key}>
                <input
                  type="file"
                  name={key}
                  onChange={handleFileChange}
                  className="hidden"
                  id={key}
                />
                <label htmlFor={key} className="cursor-pointer">
                  <div className="w-20 h-20 border-2 border-gray-300 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 transition">
                    {imagePreviews[key] ? (
                      <img src={imagePreviews[key]} alt="" className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      '+'
                    )}
                  </div>
                </label>
              </div>
            ))}
          </div>
          <button
            type="submit"
            disabled={loading || !isFormValid}
            className={`w-full py-3 px-6 rounded-lg text-lg font-semibold transition duration-200 ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-700'} focus:outline-none focus:ring-4 focus:ring-indigo-300`}
          >
            {loading ? 'Uploading...' : 'Upload Resort'}
          </button>
        </form>
      ) : (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Your Resorts</h2>
          {resorts.map((resort) => (
            <div key={resort._id} className="p-4 border rounded-lg mb-4 bg-white shadow-sm">
              {editingResort && editingResort._id === resort._id ? (
                renderEditingForm()
              ) : (
                renderResortDetails(resort)
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ModMngt;
