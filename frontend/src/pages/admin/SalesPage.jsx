import React, { useEffect, useState } from 'react';
import axiosInstance from '../../service/axios';
import { toast } from 'react-toastify';
import AdminLayout from '../../components/AdminLayout';

const SalesPage = () => {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState({ category_id: '', keyword: '' });
  const [invoiceItems, setInvoiceItems] = useState([]);
  const [paidAmount, setPaidAmount] = useState('');

  // Fetch categories and products
  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const fetchCategories = async () => {
    const res = await axiosInstance.post('/api/admin/categories');
    setCategories(res.data);
  };

  const fetchProducts = async () => {
    const res = await axiosInstance.post('/api/admin/products');
    setProducts(res.data);
    setFiltered(res.data);
  };

  // Filter handler
  const handleSearch = () => {
    const filteredList = products.filter(p => {
      const matchCategory = search.category_id === '' || p.category_id == search.category_id;
      const matchKeyword = search.keyword === '' || p.name.toLowerCase().includes(search.keyword.toLowerCase());
      return matchCategory && matchKeyword;
    });
    setFiltered(filteredList);
  };

  // Add to invoice
  const addToInvoice = (product) => {
    if (product.QTy === 0) return;

    const exists = invoiceItems.find(item => item.id === product.id);
    if (!exists) {
      setInvoiceItems([...invoiceItems, { ...product, saleQty: 1 }]);
    }
  };

  // Change qty in invoice
  const handleQtyChange = (id, qty) => {
    setInvoiceItems(prev =>
      prev.map(item => item.id === id ? { ...item, saleQty: qty } : item)
    );
  };

  const handleRemoveItem = (id) => {
    setInvoiceItems(invoiceItems.filter(i => i.id !== id));
  };

  const handleSubmitInvoice = async () => {
  if (invoiceItems.length === 0) return toast.error("No items in invoice");

  try {
    const res = await axiosInstance.post('/api/admin/sale', {
      items: invoiceItems,
      paid: paidAmount,
    });

    const invoiceId = res.data.invoice_id;
    toast.success("Invoice saved");

    // Reset form
    setInvoiceItems([]);
    setPaidAmount('');
    fetchProducts();

    // Redirect to invoice print page
    window.open(`/admin/print-invoice/${invoiceId}`, '_blank');

  } catch (err) {
    toast.error("Failed to submit invoice");
  }
};

  return (

    <AdminLayout>
    <div className="container mt-4">
      <h4 className="mb-4">Sales Page</h4>

      {/* Search Filters */}
      <div className="row mb-3">
        <div className="col-md-3">
          <select
            className="form-select"
            value={search.category_id}
            onChange={(e) => setSearch({ ...search, category_id: e.target.value })}
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
        <div className="col-md-5">
          <input
            type="text"
            className="form-control"
            placeholder="Search product"
            value={search.keyword}
            onChange={(e) => setSearch({ ...search, keyword: e.target.value })}
          />
        </div>
        <div className="col-md-2">
          <button className="btn btn-primary" onClick={handleSearch}>Search</button>
        </div>
      </div>

      {/* Product List */}
      <div className="row">
        <div className="col-md-6">
          <h5>Products</h5>
          <div className="table-responsive" style={{ maxHeight: '400px', overflowY: 'auto' }}>
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td>{p.QTy === 0 ? <span className="text-danger">Out of Stock</span> : p.QTy}</td>
                    <td>{p.Grossprice}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-success"
                        disabled={p.QTy === 0}
                        onClick={() => addToInvoice(p)}
                      >
                        Add
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan="4" className="text-center">No products found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Invoice Section */}
        <div className="col-md-6">
          <h5>Invoice</h5>
          <div className="table-responsive" style={{ maxHeight: '400px', overflowY: 'auto' }}>
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Subtotal</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {invoiceItems.map(item => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        value={item.saleQty}
                        min="1"
                        max={item.QTy}
                        onChange={(e) => handleQtyChange(item.id, parseInt(e.target.value))}
                      />
                    </td>
                    <td>{item.Grossprice}</td>
                    <td>{(item.Grossprice * item.saleQty).toFixed(2)}</td>
                    <td>
                      <button className="btn btn-sm btn-danger" onClick={() => handleRemoveItem(item.id)}>x</button>
                    </td>
                  </tr>
                ))}
                {invoiceItems.length === 0 && (
                  <tr><td colSpan="5" className="text-center">No items added</td></tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-3">
            <h6>Total: ₹{invoiceItems.reduce((sum, item) => sum + (item.Grossprice * item.saleQty), 0).toFixed(2)}</h6>

            <div className="mb-2">
              <label>Paid Amount</label>
              <input
                type="number"
                className="form-control"
                value={paidAmount}
                onChange={(e) => setPaidAmount(e.target.value)}
              />
            </div>

            <button className="btn btn-primary" onClick={handleSubmitInvoice}>
              Submit Invoice
            </button>
          </div>
        </div>
      </div>
    </div>
    </AdminLayout>
  );
};

export default SalesPage;
