// Global variables
let mapView;

// DOM elements
const zipCodeInput = document.getElementById('zipCodeInput');
const analyzeBtn = document.getElementById('analyzeBtn');
const loadingState = document.getElementById('loadingState');
const errorState = document.getElementById('errorState');
const errorMessage = document.getElementById('errorMessage');
const resultsCard = document.getElementById('resultsCard');
const zipCodeDisplay = document.getElementById('zipCodeDisplay');
const totalPopulation = document.getElementById('totalPopulation');
const medianAge = document.getElementById('medianAge');
const medianIncome = document.getElementById('medianIncome');
const homeOwnership = document.getElementById('homeOwnership');
const tapestrySegments = document.getElementById('tapestrySegments');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
  console.log('App initializing...');
  console.log('ArcGIS Config:', esriConfig);
  
  // Check if ArcGIS is loaded
  if (typeof require === 'undefined') {
    console.log('ArcGIS API not loaded, waiting...');
    setTimeout(() => {
      setupMap();
      setupEventListeners();
    }, 1000);
  } else {
    setupMap();
    setupEventListeners();
  }
});

// Setup map
async function setupMap() {
  console.log('Setting up map...');
  updateMapStatus('Setting up map...');
  
  const mapElement = document.getElementById('mapView');
  
  if (!mapElement) {
    console.error('Map element not found!');
    updateMapStatus('Error: Map element not found');
    return;
  }
  
  console.log('Map element found:', mapElement);
  console.log('Map element tag name:', mapElement.tagName);
  console.log('Map element attributes:', mapElement.attributes);
  updateMapStatus('Map element found');
  
  // Check if Map Components are loaded
  if (typeof customElements !== 'undefined' && customElements.get('arcgis-map')) {
    console.log('Map Components are available');
    updateMapStatus('Map Components Available');
  } else {
    console.warn('Map Components not available, using fallback');
    updateMapStatus('Map Components Not Available - Using Fallback');
    setupFallbackMap();
    return;
  }
  
  // Listen for the map to be ready
  mapElement.addEventListener('arcgisViewReadyChange', (event) => {
    console.log('arcgisViewReadyChange event:', event);
    if (event.detail) {
      mapView = event.detail;
      console.log('Map view is ready:', mapView);
      updateMapStatus('Map Components Ready');
      updateMapViewStatus('MapView: Ready');
    }
  });
  
  // Also try to get the view directly
  if (mapElement.view) {
    mapView = mapElement.view;
    console.log('Map view found directly:', mapView);
    updateMapStatus('Map View Found Directly');
    updateMapViewStatus('MapView: Found directly');
  }
  
  // Wait a bit for the component to initialize
  setTimeout(() => {
    if (mapElement.view) {
      mapView = mapElement.view;
      console.log('Map view found after timeout:', mapView);
      updateMapStatus('Map View Found After Timeout');
      updateMapViewStatus('MapView: Found after timeout');
      
      // Check if the map is actually rendering
      if (mapView && mapView.map) {
        console.log('Map object found:', mapView.map);
        updateMapStatus('Map Object Found - Should be visible');
        
        // Force a refresh of the map view
        mapView.when(() => {
          console.log('Map view is ready and should be visible');
          updateMapStatus('Map View Ready and Visible');
          
          // Check map visibility after a short delay
          setTimeout(() => {
            checkMapVisibility();
          }, 1000);
        }).catch(error => {
          console.error('Map view error:', error);
          updateMapStatus('Map View Error: ' + error.message);
        });
      } else {
        console.warn('Map view found but no map object, trying fallback...');
        updateMapStatus('No Map Object - Using Fallback');
        setupFallbackMap();
      }
    } else {
      console.warn('Map Components not working, trying fallback...');
      updateMapStatus('Trying fallback map...');
      setupFallbackMap();
    }
  }, 3000);
}

// Fallback map setup
async function setupFallbackMap() {
  try {
    console.log('Setting up fallback map...');
    updateMapStatus('Setting up fallback map...');
    
    // Try different import methods
    let Map, MapView;
    
    try {
      // Method 1: Direct import
      const mapModule = await import('https://js.arcgis.com/4.33/@arcgis/core/Map.js');
      const viewModule = await import('https://js.arcgis.com/4.33/@arcgis/core/views/MapView.js');
      Map = mapModule.Map;
      MapView = viewModule.MapView;
    } catch (importError) {
      console.log('Direct import failed, trying require...');
      // Method 2: Require (if available)
      if (typeof require !== 'undefined') {
        Map = require('@arcgis/core/Map').default;
        MapView = require('@arcgis/core/views/MapView').default;
      } else {
        throw new Error('No import method available');
      }
    }
    
    // Create the map
    const map = new Map({
      basemap: "arcgis/streets-vector"
    });
    
    // Create the map view
    mapView = new MapView({
      container: "mapView",
      map: map,
      zoom: 4,
      center: [-98.5795, 39.8283] // Center of USA
    });
    
    console.log('Fallback map view created:', mapView);
    updateMapStatus('Fallback Map Ready');
    updateMapViewStatus('MapView: Fallback ready');
    
  } catch (error) {
    console.error('Error setting up fallback map:', error);
    updateMapStatus('Fallback Map Error: ' + error.message);
    
    // Try simple div-based map as last resort
    try {
      const mapContainer = document.getElementById('mapView');
      if (mapContainer) {
        mapContainer.innerHTML = `
          <div style="width: 100%; height: 100%; background: #f0f0f0; display: flex; align-items: center; justify-content: center; color: #666;">
            <div style="text-align: center;">
              <h3>Map Loading...</h3>
              <p>If the map doesn't appear, check your internet connection and API key.</p>
              <p>Debug Info: ${error.message}</p>
            </div>
          </div>
        `;
        updateMapStatus('Simple Fallback Map');
      }
    } catch (simpleError) {
      console.error('Even simple fallback failed:', simpleError);
    }
  }
}

// Debug panel functions
function updateMapStatus(status) {
  const mapStatusElement = document.getElementById('mapStatus');
  if (mapStatusElement) {
    mapStatusElement.textContent = status;
  }
  console.log('Map Status:', status);
}

function updateMapViewStatus(status) {
  const mapViewStatusElement = document.getElementById('mapViewStatus');
  if (mapViewStatusElement) {
    mapViewStatusElement.textContent = status;
  }
}

function toggleDebugPanel() {
  const debugPanel = document.getElementById('debugPanel');
  if (debugPanel) {
    debugPanel.style.display = debugPanel.style.display === 'none' ? 'block' : 'none';
  }
}

// Check if map is visible
function checkMapVisibility() {
  const mapElement = document.getElementById('mapView');
  if (mapElement) {
    const rect = mapElement.getBoundingClientRect();
    console.log('Map element dimensions:', {
      width: rect.width,
      height: rect.height,
      top: rect.top,
      left: rect.left,
      visible: rect.width > 0 && rect.height > 0
    });
    
    const computedStyle = window.getComputedStyle(mapElement);
    console.log('Map element styles:', {
      display: computedStyle.display,
      visibility: computedStyle.visibility,
      width: computedStyle.width,
      height: computedStyle.height,
      position: computedStyle.position
    });
    
    updateMapStatus(`Map dimensions: ${rect.width}x${rect.height}, visible: ${rect.width > 0 && rect.height > 0}`);
  }
}

// Setup event listeners
function setupEventListeners() {
  analyzeBtn.addEventListener('click', analyzeZipCode);
  zipCodeInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') analyzeZipCode();
  });
  
  // Add a test button to the debug panel
  setTimeout(() => {
    const debugPanel = document.getElementById('debugPanel');
    if (debugPanel) {
      const testButton = document.createElement('button');
      testButton.textContent = 'Test Basic Map';
      testButton.style.cssText = 'margin-top: 5px; padding: 2px 8px; font-size: 10px; margin-left: 5px;';
      testButton.onclick = testBasicMap;
      debugPanel.appendChild(testButton);
    }
  }, 2000);
}

// Test basic map functionality
async function testBasicMap() {
  console.log('Testing basic map...');
  updateMapStatus('Testing basic map...');
  
  try {
    // Try to create a simple map using the traditional approach
    const { Map } = await import('https://js.arcgis.com/4.33/@arcgis/core/Map.js');
    const { MapView } = await import('https://js.arcgis.com/4.33/@arcgis/core/views/MapView.js');
    
    const map = new Map({
      basemap: "arcgis/streets-vector"
    });
    
    const view = new MapView({
      container: "mapView",
      map: map,
      zoom: 4,
      center: [-98.5795, 39.8283]
    });
    
    console.log('Basic map created successfully:', view);
    updateMapStatus('Basic map test successful');
    mapView = view;
    
  } catch (error) {
    console.error('Basic map test failed:', error);
    updateMapStatus('Basic map test failed: ' + error.message);
  }
}

// Analyze ZIP code function
async function analyzeZipCode() {
  const zipCode = zipCodeInput.value.trim();
  
  // Validate ZIP code
  if (!zipCode) {
    showError('Please enter a ZIP code');
    return;
  }
  
  if (!/^\d{5}$/.test(zipCode)) {
    showError('Please enter a valid 5-digit ZIP code');
    return;
  }
  
  // Show loading state
  showLoading();
  hideError();
  hideResults();
  
  try {
    console.log('Analyzing ZIP code:', zipCode);
    
    // Get demographic data
    const data = await getDemographicData(zipCode);
    
    if (data && data.length > 0) {
      const zipData = data[0];
      console.log('ZIP code data:', zipData);
      
      // Display results
      displayResults(zipCode, zipData);
      showResults();
    } else {
      showError('No data found for this ZIP code');
    }
    
  } catch (error) {
    console.error('Error analyzing ZIP code:', error);
    showError('Error fetching data. Please try again.');
  } finally {
    hideLoading();
  }
}

// Get demographic data from ArcGIS GeoEnrichment service
async function getDemographicData(zipCode) {
  const url = 'https://geoenrich.arcgis.com/arcgis/rest/services/World/geoenrichmentserver/Geoenrichment/enrich';
  
  const requestBody = {
    studyAreas: [{
      sourceCountry: "US",
      layer: "US.ZIP5",
      ids: [zipCode]
    }],
    dataCollections: [
      "KeyUSFacts",
      "US.TapestrySegmentation"
    ],
    returnGeometry: false,
    f: "json"
  };
  
  console.log('Making GeoEnrichment request:', requestBody);
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody)
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  const result = await response.json();
  console.log('GeoEnrichment response:', result);
  
  if (result.error) {
    throw new Error(result.error.message || 'GeoEnrichment service error');
  }
  
  return result.results || [];
}

// Display results
function displayResults(zipCode, data) {
  // Update ZIP code display
  zipCodeDisplay.textContent = zipCode;
  
  // Update demographics
  totalPopulation.textContent = formatNumber(data.TOTPOP || 'N/A');
  medianAge.textContent = data.MEDIAN_AGE || data.AGE_MEDIAN || 'N/A';
  medianIncome.textContent = formatCurrency(data.MEDIAN_HOUSEHOLD_INCOME || data.INCOME_MEDIAN || 'N/A');
  homeOwnership.textContent = formatPercentage(data.HOME_OWNERSHIP_RATE || data.OWNERSHIP_RATE || 'N/A');
  
  // Update Tapestry segments
  displayTapestrySegments(data);
  
  // Try to center map on ZIP code location
  centerMapOnZipCode(zipCode);
}

// Center map on ZIP code location
async function centerMapOnZipCode(zipCode) {
  if (!mapView) {
    console.warn('Map view not available for centering');
    return;
  }

  try {
    console.log('Centering map on ZIP code:', zipCode);
    
    // Get ZIP code coordinates using geocoding
    const geocodeUrl = 'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates';
    const params = new URLSearchParams({
      f: 'json',
      singleLine: zipCode,
      outFields: '*',
      maxLocations: 1
    });
    
    const response = await fetch(`${geocodeUrl}?${params.toString()}`);
    const data = await response.json();
    
    if (data.candidates && data.candidates.length > 0) {
      const candidate = data.candidates[0];
      const location = {
        longitude: candidate.location.x,
        latitude: candidate.location.y
      };
      
      console.log('ZIP code location found:', location);
      
      // Center map on location
      mapView.goTo({
        target: location,
        zoom: 12
      });
      
      console.log('Map centered on ZIP code location');
    } else {
      console.warn('Could not find coordinates for ZIP code:', zipCode);
    }
  } catch (error) {
    console.error('Error centering map on ZIP code:', error);
  }
}

// Display Tapestry segments
function displayTapestrySegments(data) {
  const tapestryFields = Object.keys(data).filter(key => 
    key.includes('Tapestry') || key.includes('Segmentation') || key.includes('Segment')
  );
  
  if (tapestryFields.length > 0) {
    const segmentsHtml = tapestryFields.map(field => {
      const value = data[field];
      if (value && typeof value === 'string' && value.trim() !== '') {
        return `
          <div class="segment-item">
            <h5>${formatFieldName(field)}</h5>
            <p>${value}</p>
          </div>
        `;
      }
      return '';
    }).join('');
    
    tapestrySegments.innerHTML = segmentsHtml;
  } else {
    tapestrySegments.innerHTML = `
      <div class="segment-item">
        <h5>Demographic Analysis</h5>
        <p>Based on available demographic data for this ZIP code</p>
      </div>
    `;
  }
}

// Utility functions
function formatNumber(num) {
  if (num === 'N/A' || num === null || num === undefined) return 'N/A';
  return new Intl.NumberFormat().format(num);
}

function formatCurrency(amount) {
  if (amount === 'N/A' || amount === null || amount === undefined) return 'N/A';
  if (typeof amount === 'string') return amount;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

function formatPercentage(value) {
  if (value === 'N/A' || value === null || value === undefined) return 'N/A';
  if (typeof value === 'string') return value;
  return value.toFixed(1) + '%';
}

function formatFieldName(fieldName) {
  return fieldName
    .replace(/_/g, ' ')
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();
}

// UI state management
function showLoading() {
  loadingState.style.display = 'block';
  analyzeBtn.disabled = true;
}

function hideLoading() {
  loadingState.style.display = 'none';
  analyzeBtn.disabled = false;
}

function showError(message) {
  errorMessage.textContent = message;
  errorState.classList.add('active');
}

function hideError() {
  errorState.classList.remove('active');
}

function showResults() {
  resultsCard.classList.add('active');
}

function hideResults() {
  resultsCard.classList.remove('active');
}
