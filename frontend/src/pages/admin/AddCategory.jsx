import React, { useState, useEffect } from 'react';
import axiosInstance from '../../service/axios';
import { toast } from 'react-toastify';
import AdminLayout from '../../components/AdminLayout';

const AddCategory = () => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedName, setEditedName] = useState('');
  const [search, setSearch] = useState('');
  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const results = categories.filter((cat) =>
      cat.name.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(results);
  }, [search, categories]);


  const fetchCategories = async () => {
    try {
      await axiosInstance.get('/sanctum/csrf-cookie');

      const res = await axiosInstance.post('/api/categories-list');
      setCategories(res.data);
    } catch (err) {
      toast.error('Failed to fetch categories.');
    }
  };


  const handleEdit = (id, currentName) => {
    setEditingId(id);
    setEditedName(currentName);
  };



  const handleSave = async (id) => {
    if (!editedName.trim()) {
      toast.error('Name cannot be empty');
      return;
    }

    try {
      await axiosInstance.put(`/api/admin/editcategories/${id}`, { name: editedName });
      toast.success('Category updated successfully');
      setEditingId(null);
      fetchCategories();
    } catch (error) {
      toast.error('Failed to update category');
    }
  };





  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Category name is required.");
      return;
    }

    try {
      setLoading(true);
      const response = await axiosInstance.post('/api/categories', { name });

      if (response) {
        toast.success(response.data?.message);

        setName('');
        fetchCategories();
      }

    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to add category';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setEditingId(null);
    setEditedName('');
  };
  return (
    <AdminLayout>
      <div className="container mt-4">
        <div className="row">
          {/* Left - Category Form */}
          <div className="col-md-5">
            <div className="card shadow p-4">
              <h4 className="mb-4 text-primary">Add New Category</h4>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="categoryName" className="form-label">Category Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="categoryName"
                    placeholder="Enter category name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Adding...' : 'Add Category'}
                </button>
              </form>
            </div>
          </div>


          <div className="col-md-7">
            <div className="card shadow p-4">
              <h4 className="mb-4 text-success">Category List</h4>

              {/* Search Input */}
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search categories..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              {/* Category List */}
              {filtered.length > 0 ? (
                <ul className="list-group">
                  {filtered.map((cat) => (
                    <li key={cat.id} className="list-group-item d-flex justify-content-between align-items-center">
                      {editingId === cat.id ? (
                        <input
                          type="text"
                          className="form-control me-2"
                          value={editedName}
                          onChange={(e) => setEditedName(e.target.value)}
                        />
                      ) : (
                        <span>{cat.name}</span>
                      )}
                      <div className="d-flex gap-2">
                        {editingId === cat.id ? (
                          <>
                            <button
                              className="btn btn-sm btn-success"
                              onClick={() => handleSave(cat.id)}
                            >
                              Save
                            </button>
                            <button
                              className="btn btn-sm btn-secondary"
                              onClick={handleReset}
                            >
                              Reset
                            </button>
                          </>
                        ) : (
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleEdit(cat.id, cat.name)}
                          >
                            Edit
                          </button>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted">No categories found.</p>
              )}
            </div>
          </div>


        </div>
      </div>
    </AdminLayout>
  );
};

export default AddCategory;
