import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../service/axios';
import './PrintInvoice.css';

const PrintInvoice = () => {
    const { id } = useParams();
    const [invoice, setInvoice] = useState(null);

    useEffect(() => {
        axiosInstance.post(`/api/admin/invoice/${id}`).then(res => {
            setInvoice(res.data);
            setTimeout(() => window.print(), 500);
        });
    }, [id]);

    if (!invoice) return <div>Loading invoice...</div>;

    return (
        <div className="container my-5" style={{ maxWidth: "800px", fontFamily: "Arial, sans-serif" }}>
            <div className="border p-4 shadow-sm">
                <div className="text-center mb-4">
                    <h2 className="mb-0">Inus Daimary</h2>
                    <small>123 Main Street, Assam, India</small><br />
                    <small>Phone: +8638140161</small>
                </div>

                <div className="d-flex justify-content-between mb-3">
                    <div>
                        <strong>Invoice ID:</strong> #{invoice.id}<br />
                        <strong>Date:</strong> {new Date(invoice.created_at).toLocaleDateString()}
                    </div>
                    <div>
                        <strong>Status:</strong>{" "}
                        <span className={invoice.due > 0 ? 'text-danger' : 'text-success'}>
                            {invoice.due > 0 ? 'Due' : 'Paid'}
                        </span>
                    </div>
                </div>

                <table className="table table-bordered table-sm">
                    <thead className="table-light">
                        <tr>
                            <th>#</th>
                            <th>Product</th>
                            <th>Qty</th>
                            <th>Rate</th>
                            <th>Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoice.items.map((item, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{item.product.name}</td>
                                <td>{item.qty}</td>
                                <td>₹{parseFloat(item.price).toFixed(2)}</td>
                                <td>₹{parseFloat(item.subtotal).toFixed(2)}</td>
                            </tr>
                        ))}

                        {/* Totals Row with rowSpan */}
                        <tr>
                            <td colSpan="4" rowSpan="3" className="align-middle text-end fw-bold no-border">
                                Totals:
                            </td>
                            <td>₹{parseFloat(invoice.total).toFixed(2)} <small className="text-muted no-border">(Total)</small></td>
                        </tr>
                        <tr>
                            <td>₹{parseFloat(invoice.paid).toFixed(2)} <small className="text-muted no-border">(Paid)</small></td>
                        </tr>
                        <tr>
                            <td className={invoice.due > 0 ? 'text-danger' : 'text-success'}>
                                ₹{parseFloat(invoice.due).toFixed(2)} <small className="text-muted no-border">(Due)</small>
                            </td>
                        </tr>


                    </tbody>
                </table>


                <div className="d-flex justify-content-end mt-4">
                    <table className="table table-bordered w-50">
                        <tbody>
                            <tr>
                                <th>Total</th>
                                <td>₹{parseFloat(invoice.total).toFixed(2)}</td>
                            </tr>
                            <tr>
                                <th>Paid</th>
                                <td>₹{parseFloat(invoice.paid).toFixed(2)}</td>
                            </tr>
                            <tr>
                                <th>Due</th>
                                <td className={invoice.due > 0 ? 'text-danger' : 'text-success'}>
                                    ₹{parseFloat(invoice.due).toFixed(2)}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="text-center mt-4">
                    <p>Thank you for your purchase!</p>
                    <small>This is a system-generated invoice.</small>
                </div>
            </div>
        </div>
    );
};

export default PrintInvoice;
