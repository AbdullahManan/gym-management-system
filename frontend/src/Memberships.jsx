import { useState, useEffect } from 'react';
function Memberships() {
 const [memberships, setMemberships] = useState([]);
  const [type, setType] = useState("");
  const [price, setPrice] = useState("");
  const [memberId, setMemberId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [editingId, setEditingId] = useState(null);



    useEffect(() => {
    fetch("http://localhost:5041/memberships")
    .then(res => res.json())
    .then(data => setMemberships(data));
  }, []);


  const AddMembership = () => {
  if (editingId) {
    fetch(`http://localhost:5041/memberships/${editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: editingId,
        type,
        price: parseFloat(price),
        memberId: Number(memberId),
        startDate,
        endDate
      })
    })
    .then(res => res.json())
    .then(updated => {
      setMemberships(memberships.map(m => m.id === editingId ? updated : m));
      setEditingId(null);
      setType("");
      setPrice("");
      setMemberId("");
      setStartDate("");
      setEndDate("");
    });
  } else {
    fetch("http://localhost:5041/memberships", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type,
        price: parseFloat(price),
        memberId: Number(memberId),
        startDate,
        endDate
      })
    })
    .then(res => res.json())
    .then(data => {
      setMemberships([...memberships, data]);
      setType("");
      setPrice("");
      setMemberId("");
      setStartDate("");
      setEndDate("");
    });
  }
};

  const DeleteMembership = (id) => {
    fetch(`http://localhost:5041/memberships/${id}`, {
      method: "DELETE" 
    })
    .then(() => {
      setMemberships(memberships.filter(m => m.id !== id));
    });
  }

  const EditMembership = (membership) => {
    setEditingId(membership.id);
    setMemberId(membership.memberId);
    setType(membership.type);
    setPrice(membership.price);
    setStartDate(membership.startDate);
    setEndDate(membership.endDate);
  }



    return (
  <div>
    <div className="page-header">
      <p className="page-eyebrow">Gym Management</p>
      <h1 className="page-title">Memberships</h1>
    </div>

    <div className="card">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Member Name</th>
            <th>Type</th>
            <th>Price</th>
            <th>Member ID</th>
            <th>Start Date</th>
            <th>End Date</th>
          </tr>
        </thead>
        <tbody>
          {memberships.map(membership => (
            <tr key={membership.id}>
              <td>{membership.id}</td>
              <td>{membership.member?.name}</td>
              <td>{membership.type}</td>
              <td>{membership.price}</td>
              <td>{membership.memberId}</td>
              <td>{membership.startDate}</td>
              <td>{membership.endDate}</td>
              <td>
                <button className="btn-edit" onClick={() => EditMembership(membership)}>Edit</button>
                <button className="btn-delete" onClick={() => DeleteMembership(membership.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <div className="card">
      <h2 className="page-title" style={{fontSize: '16px', marginBottom: '16px'}}>
        Add Membership
      </h2>
      <div className="form-row">
        <div className="form-field">
          <label>Member ID</label>
          <input
            type="number"
            value={memberId}
            onChange={(e) => setMemberId(e.target.value)}
          />
        </div>
        <div className="form-field">
          <label>Type</label>
          <input
            value={type}
            onChange={(e) => setType(e.target.value)}
          />
        </div>
        <div className="form-field">
          <label>Price</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <div className="form-field">
          <label>Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="form-field">
          <label>End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <button className="btn-primary" onClick={AddMembership}>
          Add Membership
        </button>
      </div>
    </div>
  </div>
);
}

export default Memberships;