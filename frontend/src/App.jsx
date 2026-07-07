import './App.css';
import Members from './Members';
import Memberships from './Memberships';
import { useState } from 'react';


function App() {
    const [activeTab, setActiveTab] = useState("members");


return (
  <div className="app-layout">
    <aside className="sidebar">
      <div className="sidebar-brand">
        <h2>Gym Manager</h2>
      </div>

      <nav>
        <a href="#" onClick={() => setActiveTab("members")} className="sidebar-member">Members</a>
        <a href="#" onClick={() => setActiveTab("memberships")} className="sidebar-membership">Memberships</a>
      </nav>
    </aside>

    <main className="main-content">
      {activeTab === 'members' && <Members />}
      {activeTab === 'memberships' && <Memberships />}
    </main>
  </div>
);

}


export default App;