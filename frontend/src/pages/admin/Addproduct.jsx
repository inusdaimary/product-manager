import React, { useState, useEffect } from 'react';
import axiosInstance from '../../service/axios';
import { toast } from 'react-toastify';
import AdminLayout from '../../components/AdminLayout';

const AddProduct = () => {
    const [formData, setFormData] = useState({
        category_id: '',
        name: '',
        brand: '',
        warranty: '',
        date_expire: '',
        description: '',
        QTy: 1,
        Grossprice: 0,
        Totalprice: 0,
        image: null,
    });

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);

    // Load categories and products
    useEffect(() => {
        fetchCategories();
        fetchProducts();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await axiosInstance.post('/api/admin/categories');
            setCategories(res.data);
        } catch (err) {
            toast.error('Failed to fetch categories');
        }
    };

    const fetchProducts = async () => {
        try {
            const res = await axiosInstance.post('/api/admin/products');
            setProducts(res.data);
        } catch (err) {
            toast.error('Failed to fetch products');
        }
    };

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        const val = type === 'file' ? files[0] : value;

        const updatedData = {
            ...formData,
            [name]: val,
        };

        // Calculate total price on qty or gross price change
        if (name === 'QTy' || name === 'Grossprice') {
            updatedData.Totalprice = parseFloat(updatedData.Grossprice || 0) * parseInt(updatedData.QTy || 0);
        }

        setFormData(updatedData);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();


        for (let key in formData) {
            if (formData[key] !== null) {
                data.append(key, formData[key]);
            }
        }

        try {
            if (isEditing) {
                await axiosInstance.post(`/api/admin/update/product/${editId}`, data);
                toast.success('Product updated successfully');
            } else {
                await axiosInstance.post('/api/admin/add/products', data);
                toast.success('Product added successfully');
            }

            fetchProducts();
            handleCancelEdit(); // reset form and state

        } catch (error) {
            toast.error(isEditing ? 'Error updating product' : 'Error adding product');
        }
    };


    const handleEdit = (product) => {
        setFormData({
            ...product,
            image: null
        });
        setEditId(product.id);
        setIsEditing(true);
    }


    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;

        try {
            await axiosInstance.delete(`api/admin/deleteproducts/${id}`);
            toast.success("Product deleted successfully");
            fetchProducts();
        } catch (error) {
            toast.error("Failed to delete product");
        }
    };




    const handleCancelEdit = () => {
        setFormData({
            category_id: '',
            name: '',
            brand: '',
            warranty: '',
            date_expire: '',
            description: '',
            QTy: 1,
            Grossprice: 0,
            Totalprice: 0,
            image: null,
        });
        setEditId(null);
        setIsEditing(false);
    };

    return (
        <AdminLayout>
            <div className="row">
                {/* Left: Add Product Form */}
                <div className="col-md-6">
                    <div className="card p-4 shadow">
                        <h5 className="mb-3">Add Product</h5>
                        <form onSubmit={handleSubmit} encType="multipart/form-data">
                            <div className="mb-3">
                                <label className="form-label">Category</label>
                                <select name="category_id" className="form-select" value={formData.category_id} onChange={handleChange} required>
                                    <option value="">Select Category</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Name</label>
                                <input type="text" className="form-control" placeholder='Name' name="name" value={formData.name} onChange={handleChange} required />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Brand</label>
                                <input type="text" className="form-control" placeholder='Brand' name="brand" value={formData.brand} onChange={handleChange} />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Warranty</label>
                                <input type="text" placeholder='Warranty' className="form-control" name="warranty" value={formData.warranty} onChange={handleChange} />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Expire Date</label>
                                <input type="date" className="form-control" name="date_expire" value={formData.date_expire} onChange={handleChange} />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Description</label>
                                <textarea className="form-control" placeholder='Description' name="description" value={formData.description} onChange={handleChange}></textarea>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Quantity</label>
                                <input type="number" className="form-control" name="QTy" value={formData.QTy} onChange={handleChange} min="1" required />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Gross Price</label>
                                <input type="number" className="form-control" name="Grossprice" value={formData.Grossprice} onChange={handleChange} step="0.01" required />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Total Price</label>
                                <input type="number" disabled className="form-control" name="Totalprice" value={formData.Totalprice} readOnly />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Image</label>
                                <input type="file" className="form-control" name="image" onChange={handleChange} accept="image/*" />
                            </div>

                            {isEditing ? (
                                <>
                                    <button type="submit" className="btn btn-warning me-2">Update Product</button>
                                    <button type="button" className="btn btn-secondary" onClick={handleCancelEdit}>Cancel</button>
                                </>
                            ) : (
                                <button type="submit" className="btn btn-primary">Add Product</button>
                            )}
                        </form>
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="card p-4 shadow">
                        <h5 className="mb-3">Product List</h5>
                        <div className="table-responsive" style={{ maxHeight: '450px', overflowY: 'auto' }}>
                            <table className="table table-bordered table-hover">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Image</th>
                                        <th>Name</th>
                                        <th>Qty</th>
                                        <th>Gross</th>
                                        <th>Total</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((p, index) => (
                                        <tr key={p.id}>
                                            <td>{index + 1}</td>
                                            <td>
                                                {p.image ? (
                                                    <img
                                                        src={`http://localhost:8000/${p.image}`}

                                                        alt="product"
                                                        width="50"
                                                        height="50"
                                                        style={{ objectFit: 'cover', borderRadius: '5px' }}
                                                    />
                                                ) : (
                                                    <span className="text-muted">No image</span>
                                                )}
                                            </td>
                                            <td>{p.name}</td>
                                            <td>{p.QTy}</td>
                                            <td>{p.Grossprice}</td>
                                            <td>{p.Totalprice}</td>
                                            <td>
                                                <button
                                                    className="btn btn-sm btn-warning me-2"
                                                    onClick={() => handleEdit(p)}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-danger"
                                                    onClick={() => handleDelete(p.id)}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {products.length === 0 && (
                                        <tr>
                                            <td colSpan="7" className="text-center">No products found</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>

                            {isEditing && (
                                <div className="text-end mt-2">
                                    <button className="btn btn-secondary btn-sm" onClick={handleCancelEdit}>
                                        Cancel Edit
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>



            </div>
        </AdminLayout>
    );
};

export default AddProduct;
