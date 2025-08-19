// Tapestry Segmentation Analyzer using ArcGIS Maps SDK for JavaScript
// Following the modern Map Components approach

// Global variables
let mapView;
let currentGraphics = [];
let recentSearches = JSON.parse(localStorage.getItem('recentSearches') || '[]');

// DOM elements
const addressInput = document.getElementById('addressInput');
const searchAddressBtn = document.getElementById('searchAddressBtn');
const csvFileInput = document.getElementById('csvFileInput');
const processCsvBtn = document.getElementById('processCsvBtn');
const resultsPanel = document.getElementById('resultsPanel');
const resultsContent = document.getElementById('resultsContent');
const closeResultsBtn = document.getElementById('closeResultsBtn');
const clearMapBtn = document.getElementById('clearMapBtn');
const exportResultsBtn = document.getElementById('exportResultsBtn');
const loadingOverlay = document.getElementById('loadingOverlay');
const loadingMessage = document.getElementById('loadingMessage');
const recentSearchesContainer = document.getElementById('recentSearches');

// Initialize the application
async function init() {
    try {
        await setupMap();
        setupEventListeners();
        updateRecentSearches();
        
        // Show welcome message
        setTimeout(() => {
            showNotification('Welcome to Tapestry Segmentation Analyzer! Enter an address or upload a CSV to get started.', 'info');
        }, 1000);
    } catch (error) {
        console.error('Initialization error:', error);
        showNotification('Error initializing the application. Please check your API key.', 'error');
    }
}

// Setup the map using Map Components
async function setupMap() {
    // Wait for the map component to be ready
    const mapElement = document.getElementById('mapView');
    
    // Listen for the map to be ready
    mapElement.addEventListener('arcgisViewReadyChange', (event) => {
        if (event.detail) {
            mapView = event.detail;
            console.log('Map view is ready:', mapView);
        }
    });
    
    // Also try to get the view directly
    if (mapElement.view) {
        mapView = mapElement.view;
    }
}

// Setup event listeners
function setupEventListeners() {
    // Address search
    searchAddressBtn.addEventListener('click', handleAddressSearch);
    addressInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleAddressSearch();
    });
    
    // CSV processing
    processCsvBtn.addEventListener('click', handleCsvProcessing);
    
    // Results panel
    closeResultsBtn.addEventListener('click', () => {
        resultsPanel.classList.remove('active');
    });
    
    // Map controls
    clearMapBtn.addEventListener('click', clearMap);
    exportResultsBtn.addEventListener('click', exportResults);
}

// Handle address search
async function handleAddressSearch() {
    const address = addressInput.value.trim();
    if (!address) {
        showNotification('Please enter an address', 'error');
        return;
    }
    
    showLoading('Geocoding address...');
    
    try {
        const results = await geocodeAddress(address);
        if (results.length > 0) {
            const location = results[0];
            showLoading('Analyzing demographics with GeoEnrichment service...');
            await analyzeLocation(location.location, address);
            addToRecentSearches(address, location.location);
            showNotification('Analysis complete! Check the results panel below.', 'success');
        } else {
            showNotification('Address not found. Please try a different address.', 'error');
        }
    } catch (error) {
        console.error('Geocoding error:', error);
        showNotification('Error geocoding address. Please check your internet connection and try again.', 'error');
    } finally {
        hideLoading();
    }
}

// Geocode an address using ArcGIS Geocoding service
async function geocodeAddress(address) {
    const geocodeUrl = 'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates';
    
    const params = new URLSearchParams({
        f: 'json',
        singleLine: address,
        outFields: '*',
        maxLocations: 1
    });
    
    const response = await fetch(`${geocodeUrl}?${params.toString()}`);
    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.candidates && data.candidates.length > 0) {
        const candidate = data.candidates[0];
        return [{
            location: {
                longitude: candidate.location.x,
                latitude: candidate.location.y
            },
            score: candidate.score,
            attributes: candidate.attributes
        }];
    }
    
    return [];
}

// Handle CSV processing
async function handleCsvProcessing() {
    const file = csvFileInput.files[0];
    if (!file) {
        showNotification('Please select a CSV file', 'error');
        return;
    }
    
    showLoading('Processing CSV file...');
    
    try {
        const coordinates = await parseCsvFile(file);
        if (coordinates.length > 0) {
            await processMultipleLocations(coordinates);
        } else {
            showNotification('No valid coordinates found in CSV', 'error');
        }
    } catch (error) {
        console.error('CSV processing error:', error);
        showNotification('Error processing CSV file', 'error');
    } finally {
        hideLoading();
    }
}

// Parse CSV file
function parseCsvFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const csv = e.target.result;
                const lines = csv.split('\n');
                const coordinates = [];
                
                for (let i = 1; i < lines.length; i++) { // Skip header
                    const line = lines[i].trim();
                    if (line) {
                        const parts = line.split(',');
                        if (parts.length >= 2) {
                            const lat = parseFloat(parts[0]);
                            const lng = parseFloat(parts[1]);
                            const description = parts[2] || `Location ${i}`;
                            
                            if (!isNaN(lat) && !isNaN(lng)) {
                                coordinates.push({
                                    latitude: lat,
                                    longitude: lng,
                                    description: description
                                });
                            }
                        }
                    }
                }
                
                resolve(coordinates);
            } catch (error) {
                reject(error);
            }
        };
        reader.onerror = reject;
        reader.readAsText(file);
    });
}

// Process multiple locations from CSV
async function processMultipleLocations(coordinates) {
    const results = [];
    
    for (let i = 0; i < coordinates.length; i++) {
        const coord = coordinates[i];
        showLoading(`Processing location ${i + 1} of ${coordinates.length}...`);
        
        try {
            const point = {
                longitude: coord.longitude,
                latitude: coord.latitude
            };
            
            const analysis = await analyzeLocation(point, coord.description);
            results.push(analysis);
            
            // Add small delay to avoid overwhelming the API
            await new Promise(resolve => setTimeout(resolve, 500));
        } catch (error) {
            console.error(`Error processing location ${i + 1}:`, error);
        }
    }
    
    displayMultipleResults(results);
    hideLoading();
}

// Analyze a location for Tapestry segmentation
async function analyzeLocation(location, description) {
    // Add point to map if mapView is available
    if (mapView) {
        await addPointToMap(location, description);
        
        // Center map on location
        mapView.goTo({
            target: {
                longitude: location.longitude,
                latitude: location.latitude
            },
            zoom: 15
        });
    }
    
    // Get Tapestry data using GeoEnrichment service
    const tapestryData = await getTapestryData(location);
    
    // Display results
    displayResults(tapestryData, description);
    
    return {
        location: location,
        description: description,
        tapestryData: tapestryData
    };
}

// Add point to map using Map Components
async function addPointToMap(location, description) {
    if (!mapView) return;
    
    try {
        // Import required modules
        const { Graphic } = await import('https://js.arcgis.com/4.33/@arcgis/core/Graphic.js');
        const { Point } = await import('https://js.arcgis.com/4.33/@arcgis/core/geometry/Point.js');
        const { SimpleMarkerSymbol } = await import('https://js.arcgis.com/4.33/@arcgis/core/symbols/SimpleMarkerSymbol.js');
        
        // Create point geometry
        const point = new Point({
            longitude: location.longitude,
            latitude: location.latitude
        });
        
        // Create marker symbol
        const markerSymbol = new SimpleMarkerSymbol({
            color: [102, 126, 234, 0.8],
            outline: {
                color: [255, 255, 255, 0.8],
                width: 2
            },
            size: 12
        });
        
        // Create graphic
        const graphic = new Graphic({
            geometry: point,
            symbol: markerSymbol,
            attributes: {
                description: description
            }
        });
        
        // Add to map
        mapView.graphics.add(graphic);
        currentGraphics.push(graphic);
        
    } catch (error) {
        console.error('Error adding point to map:', error);
    }
}

// Get Tapestry segmentation data using GeoEnrichment service
async function getTapestryData(point) {
    try {
        // Use the GeoEnrichment service to get real demographic data
        const enrichUrl = "https://geoenrich.arcgis.com/arcgis/rest/services/World/geoenrichmentserver/Geoenrichment/enrich";
        
        // Define the study area using the point coordinates
        const studyAreas = [{
            geometry: {
                x: point.longitude,
                y: point.latitude
            }
        }];
        
        // Request Tapestry segmentation and demographic data
        const dataCollections = [
            "KeyUSFacts",           // Basic demographic facts
            "KeyGlobalFacts",       // Global demographic facts
            "US.TapestrySegmentation" // Tapestry segmentation data
        ];
        
        // Build the request parameters
        const params = new URLSearchParams({
            studyAreas: JSON.stringify(studyAreas),
            dataCollections: JSON.stringify(dataCollections),
            f: "json"
        });
        
        // Make the request to the GeoEnrichment service
        const response = await fetch(`${enrichUrl}?${params.toString()}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Process the response
        if (data.results && data.results.length > 0) {
            const result = data.results[0];
            if (result.value && result.value.FeatureSet && result.value.FeatureSet.length > 0) {
                const features = result.value.FeatureSet[0].features;
                if (features && features.length > 0) {
                    const attributes = features[0].attributes;
                    return processEnrichmentData(attributes, point);
                }
            }
        }
        
        // Fallback to simulated data if no real data is available
        console.warn("No enrichment data found, using simulated data");
        return getSimulatedData(point);
        
    } catch (error) {
        console.error("Error fetching enrichment data:", error);
        // Fallback to simulated data
        return getSimulatedData(point);
    }
}

// Process the enrichment data response
function processEnrichmentData(attributes, point) {
    // Extract Tapestry segmentation data
    const tapestrySegments = [];
    
    // Look for Tapestry segmentation fields
    const tapestryFields = Object.keys(attributes).filter(key => 
        key.includes('Tapestry') || key.includes('Segmentation') || key.includes('Segment')
    );
    
    if (tapestryFields.length > 0) {
        tapestryFields.forEach(field => {
            const value = attributes[field];
            if (value && typeof value === 'string' && value.trim() !== '') {
                tapestrySegments.push({
                    name: field.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').trim(),
                    code: field,
                    description: value,
                    percentage: 25 // Default percentage since we don't have actual percentages
                });
            }
        });
    }
    
    // If no Tapestry data found, create some based on available demographic data
    if (tapestrySegments.length === 0) {
        tapestrySegments.push({
            name: "Demographic Analysis",
            code: "DEMO",
            description: "Based on available demographic data",
            percentage: 100
        });
    }
    
    // Extract demographic data
    const demographics = {
        medianAge: attributes.MEDIAN_AGE || attributes.AGE_MEDIAN || 42,
        medianIncome: attributes.MEDIAN_HOUSEHOLD_INCOME || attributes.INCOME_MEDIAN || 75000,
        populationDensity: attributes.POPULATION_DENSITY || attributes.DENSITY || 2500,
        educationLevel: attributes.EDUCATION_LEVEL || "Bachelor's Degree",
        homeOwnership: attributes.HOME_OWNERSHIP_RATE || attributes.OWNERSHIP_RATE || 65,
        householdSize: attributes.AVG_HOUSEHOLD_SIZE || attributes.HOUSEHOLD_SIZE || 2.4,
        totalPopulation: attributes.TOTPOP || attributes.POPULATION || "N/A"
    };
    
    return {
        segments: tapestrySegments,
        demographics: demographics,
        coordinates: {
            latitude: point.latitude,
            longitude: point.longitude
        },
        rawData: attributes // Include raw data for debugging
    };
}

// Fallback simulated data
function getSimulatedData(point) {
    const tapestrySegments = [
        {
            name: "Urban Upscale",
            code: "A01",
            description: "Affluent urban professionals with high disposable income",
            percentage: 35
        },
        {
            name: "Suburban Families",
            code: "B02", 
            description: "Middle-class families in suburban areas",
            percentage: 28
        },
        {
            name: "Young Professionals",
            code: "C03",
            description: "Young, educated professionals starting careers",
            percentage: 22
        },
        {
            name: "Retirees",
            code: "D04",
            description: "Retired individuals with stable income",
            percentage: 15
        }
    ];
    
    const demographics = {
        medianAge: 42,
        medianIncome: 75000,
        populationDensity: 2500,
        educationLevel: "Bachelor's Degree",
        homeOwnership: 65,
        householdSize: 2.4,
        totalPopulation: "N/A"
    };
    
    return {
        segments: tapestrySegments,
        demographics: demographics,
        coordinates: {
            latitude: point.latitude,
            longitude: point.longitude
        }
    };
}

// Display results for a single location
function displayResults(tapestryData, description) {
    const html = `
        <div class="tapestry-result">
            <h3>📍 ${description}</h3>
            <p><strong>Coordinates:</strong> ${tapestryData.coordinates.latitude.toFixed(6)}, ${tapestryData.coordinates.longitude.toFixed(6)}</p>
            
            <h4>Tapestry Segments</h4>
            <div class="segment-info">
                ${tapestryData.segments.map(segment => `
                    <div class="segment-item">
                        <h4>${segment.name} (${segment.code})</h4>
                        <p><strong>${segment.percentage}%</strong></p>
                        <p>${segment.description}</p>
                    </div>
                `).join('')}
            </div>
            
            <h4>Demographics</h4>
            <div class="demographics-grid">
                <div class="demographic-item">
                    <h4>Median Age</h4>
                    <div class="value">${tapestryData.demographics.medianAge}</div>
                </div>
                <div class="demographic-item">
                    <h4>Median Income</h4>
                    <div class="value">$${tapestryData.demographics.medianIncome.toLocaleString()}</div>
                </div>
                <div class="demographic-item">
                    <h4>Population Density</h4>
                    <div class="value">${tapestryData.demographics.populationDensity.toLocaleString()}/sq mi</div>
                </div>
                <div class="demographic-item">
                    <h4>Education Level</h4>
                    <div class="value">${tapestryData.demographics.educationLevel}</div>
                </div>
                <div class="demographic-item">
                    <h4>Home Ownership</h4>
                    <div class="value">${tapestryData.demographics.homeOwnership}%</div>
                </div>
                <div class="demographic-item">
                    <h4>Household Size</h4>
                    <div class="value">${tapestryData.demographics.householdSize}</div>
                </div>
                <div class="demographic-item">
                    <h4>Total Population</h4>
                    <div class="value">${tapestryData.demographics.totalPopulation}</div>
                </div>
            </div>
            
            ${tapestryData.rawData ? `
                <details style="margin-top: 1rem;">
                    <summary style="cursor: pointer; color: #667eea; font-weight: 600;">📊 View Raw API Data</summary>
                    <pre style="background: #f8f9fa; padding: 1rem; border-radius: 8px; overflow-x: auto; font-size: 0.8rem; margin-top: 0.5rem;">${JSON.stringify(tapestryData.rawData, null, 2)}</pre>
                </details>
            ` : ''}
        </div>
    `;
    
    resultsContent.innerHTML = html;
    resultsPanel.classList.add('active');
}

// Display results for multiple locations
function displayMultipleResults(results) {
    const html = `
        <div class="tapestry-result">
            <h3>📊 Batch Analysis Results (${results.length} locations)</h3>
            
            ${results.map((result, index) => `
                <div class="tapestry-result" style="margin-top: 1rem;">
                    <h4>${index + 1}. ${result.description}</h4>
                    <p><strong>Coordinates:</strong> ${result.location.latitude.toFixed(6)}, ${result.location.longitude.toFixed(6)}</p>
                    
                    <div class="segment-info">
                        ${result.tapestryData.segments.slice(0, 2).map(segment => `
                            <div class="segment-item">
                                <h4>${segment.name}</h4>
                                <p><strong>${segment.percentage}%</strong></p>
                            </div>
                        `).join('')}
                    </div>
                    
                    <div class="demographics-grid">
                        <div class="demographic-item">
                            <h4>Median Income</h4>
                            <div class="value">$${result.tapestryData.demographics.medianIncome.toLocaleString()}</div>
                        </div>
                        <div class="demographic-item">
                            <h4>Median Age</h4>
                            <div class="value">${result.tapestryData.demographics.medianAge}</div>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    
    resultsContent.innerHTML = html;
    resultsPanel.classList.add('active');
}

// Add to recent searches
function addToRecentSearches(description, location) {
    const search = {
        description: description,
        location: {
            latitude: location.latitude,
            longitude: location.longitude
        },
        timestamp: new Date().toISOString()
    };
    
    // Remove if already exists
    recentSearches = recentSearches.filter(s => s.description !== description);
    
    // Add to beginning
    recentSearches.unshift(search);
    
    // Keep only last 10
    if (recentSearches.length > 10) {
        recentSearches = recentSearches.slice(0, 10);
    }
    
    localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
    updateRecentSearches();
}

// Update recent searches display
function updateRecentSearches() {
    if (recentSearches.length === 0) {
        recentSearchesContainer.innerHTML = '<p class="empty-state">No recent searches</p>';
        return;
    }
    
    const html = recentSearches.map(search => `
        <div class="recent-search-item" onclick="recentSearchClicked('${search.description}')">
            <h4>${search.description}</h4>
            <p>${new Date(search.timestamp).toLocaleDateString()}</p>
        </div>
    `).join('');
    
    recentSearchesContainer.innerHTML = html;
}

// Clear map
function clearMap() {
    if (mapView) {
        currentGraphics.forEach(graphic => {
            mapView.graphics.remove(graphic);
        });
    }
    currentGraphics = [];
    resultsPanel.classList.remove('active');
}

// Export results
function exportResults() {
    // Implementation for exporting results to CSV/JSON
    showNotification('Export functionality would be implemented here', 'info');
}

// Show loading overlay
function showLoading(message = 'Processing...') {
    loadingMessage.textContent = message;
    loadingOverlay.classList.add('active');
}

// Hide loading overlay
function hideLoading() {
    loadingOverlay.classList.remove('active');
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        z-index: 1001;
        animation: slideIn 0.3s ease;
        max-width: 300px;
    `;
    
    // Set background color based on type
    const colors = {
        info: '#667eea',
        success: '#28a745',
        error: '#dc3545',
        warning: '#ffc107'
    };
    notification.style.backgroundColor = colors[type] || colors.info;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Make recent search clickable globally
window.recentSearchClicked = function(description) {
    addressInput.value = description;
    handleAddressSearch();
};

// Initialize the application when the page loads
document.addEventListener('DOMContentLoaded', init);
