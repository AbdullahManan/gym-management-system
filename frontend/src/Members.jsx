import { useState, useEffect } from 'react';

function Members() {
  const [members, setmembers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
    

  useEffect(() => {
    fetch("http://localhost:5041/members")
      .then(res => res.json())
      .then(data => setmembers(data));
  }, []);

  const DeleteMember = (id) => {
    fetch(`http://localhost:5041/members/${id}`, {
      method: "DELETE"
    })
    .then(() => {
      setmembers(members.filter(m => m.id !== id));
    });
  };

  const AddMember = () => {

  const member = {
    name,
    email
  };

  if (editingId === null) {

    fetch("http://localhost:5041/members", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(member)
    })
    .then(res => res.json())
    .then(newMember => {
      setmembers([...members, newMember]);
      setName("");
      setEmail("");
    });

  }
  else {

    fetch(`http://localhost:5041/members/${editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(member)
    })
    .then(() => {

      setmembers(
        members.map(m =>
          m.id === editingId ? { ...m, ...member } : m
        )
      );

      setEditingId(null);
      setName("");
      setEmail("");
    });

  }
};

  const EditMember = (member) => {
    setEditingId(member.id);
    setName(member.name);
    setEmail(member.email);
  }

  const filteredMembers = members.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) || m.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
  <div>
    <div className="page-header">
      <p className="page-eyebrow">Gym Management</p>
      <h1 className="page-title">Members</h1>
    </div>

    <div className ="search-bar">
      <label>Search Members</label> <br/>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>

    <div className="card">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredMembers.map(m => (
            <tr key={m.id}>
              <td>{m.id}</td>
              <td>{m.name}</td>
              <td>{m.email}</td>
              <td>
                <button className="btn-edit" onClick={() => EditMember(m)}>Edit</button>
                <button className="btn-delete" onClick={() => DeleteMember(m.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <div className="card">
      <h2 className="page-title" style={{fontSize: '16px', marginBottom: '16px'}}>
        {editingId ? "Edit Member" : "Add Member"}
      </h2>
      <div className="form-row">
        <div className="form-field">
          <label>Name</label>
          <input 
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        </div>
        <div className="form-field">
          <label>Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button className="btn-primary" onClick={AddMember}>
          {editingId ? "Update Member" : "Add Member"}
        </button>
      </div>
    </div>
  </div>
);
}

export default Members;