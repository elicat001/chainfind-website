
// SYSTEM CONFIGURATION
// ====================

export const API_CONFIG = {
  // Toggle this to FALSE to connect to the real backend server
  USE_MOCK_API: true, 

  // Reserved Backend Port Configuration
  // Standard Node.js/Express port or Python/Django port
  API_BASE_URL: 'http://localhost:8080/api/v1',
  
  // Network Simulation Settings (only affects Mock Mode)
  SIMULATE_LATENCY_MS: 800, 
};

export const SYSTEM_STATUS = {
  VERSION: '2.5.1-STABLE',
  LAST_UPDATED: new Date().toISOString().split('T')[0],
};
