import React, { useState, useEffect } from 'react';
import { AiOutlineUnorderedList, AiOutlineAppstore } from 'react-icons/ai';
import './App.css';

function App() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(10); // Update the total pages to 10
  const [viewMode, setViewMode] = useState('list');

  const itemsPerPage = 10;

  useEffect(() => {
    const fetchUsers = () => {
      const promises = [];
      for (let page = 1; page <= totalPages; page++) {
        promises.push(fetch(`https://reqres.in/api/users?page=${page}`).then((response) => response.json()));
      }
      Promise.all(promises).then((data) => {
        const allUsers = data.reduce((acc, curr) => [...acc, ...curr.data], []);
        setUsers(allUsers);
      });
    };

    fetchUsers();
  }, [totalPages]);

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleViewMode = (mode) => {
    setViewMode(mode);
  };

  const filteredUsers = users.filter((user) =>
    user.first_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const renderUsers = () => {
    if (viewMode === 'list') {
      return (
        <div className="user-list">
          {paginatedUsers.map((user) => (
            <div key={user.id} className="user-item">
              <img src={user.avatar} alt={user.first_name} className="avatar" />
              <div className="user-details">
                <p>ID: {user.id}</p>
                <p>Name: {user.first_name}</p>
              </div>
            </div>
          ))}
        </div>
      );
    } else if (viewMode === 'icon') {
      return (
        <div className="user-icons">
          {paginatedUsers.map((user) => (
            <div key={user.id} className="user-icon">
              <img src={user.avatar} alt={user.first_name} className="avatar" />
              <p className="user-name">{user.first_name}</p>
            </div>
          ))}
        </div>
      );
    }
  };

  return (
    <div className="app-container">
      <div className="header">
        <h1>Employee Directory</h1>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by first name"
            value={searchTerm}
            onChange={handleChange}
          />
        </div>
        <div className="view-modes">
          <button
            className={`view-mode-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => handleViewMode('list')}
          >
            <AiOutlineUnorderedList size={32} />
          </button>
          <button
            className={`view-mode-btn ${viewMode === 'icon' ? 'active' : ''}`}
            onClick={() => handleViewMode('icon')}
          >
            <AiOutlineAppstore size={32} />
          </button>
        </div>
      </div>
      {renderUsers()}
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
          <button
            key={page}
            className={currentPage === page ? 'active' : ''}
            onClick={() => handlePageChange(page)}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  );
}

export default App;
