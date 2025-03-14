"use client";
import React, { useState } from 'react';

const Scope2 = () => {
  const [activeTab, setActiveTab] = useState('Consommation délectricité');

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  const renderTable = () => {
    return (
      <div className="table-container" style={{ padding: '20px' }}>
        <h4 style={{ marginBottom: '15px' }}>{getTableTitle()}</h4>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #e9ecef' }}>
              {activeTab === 'Consommation délectricité' && (
                <>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Consommation électrique (kW)</th>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Durée de fonctionnement (heures)</th>
                </>
              )}
              {activeTab === 'Chauffage ' || activeTab === 'Refroidissement' ? (
                <>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Nom</th>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Type</th>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Énergie Consommée</th>
                </>
              ) : null}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={getColSpan()} style={{ textAlign: 'center', padding: '30px' }}>
                Aucune donnée disponible pour {getTableTitle().toLowerCase()}
              </td>
            </tr>
          </tbody>
        </table>
        <div style={{ textAlign: 'right', marginTop: '20px' }}>
          <button
            style={{
              backgroundColor: '#76b82a',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              fontSize: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              margin: '0 0 0 auto',
            }}
          >
            +
          </button>
        </div>
      </div>
    );
  };

  const getTableTitle = () => {
    switch (activeTab) {
      case 'Consommation délectricité':
        return 'Consommation d\'électricité';
      case 'Chauffage ':
        return 'Chauffage';
      case 'Refroidissement':
        return 'Refroidissement';
      default:
        return 'Consommation d\'électricité';
    }
  };

  const getColSpan = () => {
    if (activeTab === 'Consommation délectricité') {
      return 2;
    }
    return 3; 
  };

  return (
    <div className="scope3-container mt-5" style={{ backgroundColor: '#f8f9fa', padding: '20px' }}>
      <div className="card">
        <div className="card-body">
          <b><p style={{ color: '#8EBE21' }}>Scope 2</p></b>
          <p><b style={{ color: '#263589' }}>Émissions indirectes </b>provenant de sources détenues ou contrôlées par une organisation.</p>
        </div>
      </div>

      <div className="scope3-tabs-container mt-4" style={{ backgroundColor: 'white', borderRadius: '5px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div className="scope3-tabs">
          <ul className="nav" style={{ display: 'flex', listStyle: 'none', padding: '0', margin: '0', borderBottom: '1px solid #e9ecef' }}>
            <li className="nav-item" style={{ padding: '15px 0', textAlign: 'center', flex: '1' }}>
              <a
                href="#Consommation délectricité"
                className={`nav-link ${activeTab === 'Consommation délectricité' ? 'active' : ''}`}
                style={{
                  color: activeTab === 'Consommation délectricité' ? '#76b82a' : '#333',
                  textDecoration: 'none',
                  fontSize: '14px',
                  borderBottom: activeTab === 'Consommation délectricité' ? '2px solid #76b82a' : 'none',
                  paddingBottom: '15px',
                }}
                onClick={(e) => {
                  e.preventDefault();
                  handleTabClick('Consommation délectricité');
                }}
              >
                Consommation d'électricité
              </a>
            </li>
            <li className="nav-item" style={{ padding: '15px 0', textAlign: 'center', flex: '1' }}>
              <a
                href="#Chauffage"
                className={`nav-link ${activeTab === 'Chauffage ' ? 'active' : ''}`}
                style={{
                  color: activeTab === 'Chauffage ' ? '#76b82a' : '#333',
                  textDecoration: 'none',
                  fontSize: '14px',
                  borderBottom: activeTab === 'Chauffage ' ? '2px solid #76b82a' : 'none',
                  paddingBottom: '15px',
                }}
                onClick={(e) => {
                  e.preventDefault();
                  handleTabClick('Chauffage ');
                }}
              >
                Chauffage
              </a>
            </li>
            <li className="nav-item" style={{ padding: '15px 0', textAlign: 'center', flex: '1' }}>
              <a
                href="#Refroidissement"
                className={`nav-link ${activeTab === 'Refroidissement' ? 'active' : ''}`}
                style={{
                  color: activeTab === 'Refroidissement' ? '#76b82a' : '#333',
                  textDecoration: 'none',
                  fontSize: '14px',
                  borderBottom: activeTab === 'Refroidissement' ? '2px solid #76b82a' : 'none',
                  paddingBottom: '15px',
                }}
                onClick={(e) => {
                  e.preventDefault();
                  handleTabClick('Refroidissement');
                }}
              >
                Refroidissement
              </a>
            </li>
          </ul>
        </div>

        <div className="tab-content">{renderTable()}</div>
      </div>
    </div>
  );
};

export default Scope2;
