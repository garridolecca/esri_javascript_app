# 🗺️ ArcGIS Map with Search

A beautiful, interactive web application built with the ArcGIS JavaScript API that allows users to search for addresses and places with a stunning ocean-inspired design.

## ✨ Features

### 🎯 Core Functionality
- **Interactive Map Display** - Powered by ArcGIS JavaScript API 4.33
- **Address Search** - Search for any address or place name
- **Real-time Geocoding** - Convert addresses to map coordinates
- **Visual Markers** - Custom markers with pin emojis at searched locations
- **Dual Search Interface** - Built-in search widget + custom sidebar input

### Usage
1. **Search for Addresses**:
   - Use the search box in the top-right corner of the map
   - Or enter an address in the sidebar input field and click "Search Address"

2. **Test Examples**:
   - Seattle
   - Space Needle
   - Hollywood Blvd
   - 1600 Pennsylvania Avenue, Washington, DC
   - 34.13419, -118.29636

3. **Clear Results**:
   - Click "Clear Map" to remove markers and reset the interface

## 🛠️ Technical Details

### Built With
- **ArcGIS JavaScript API 4.33** - Core mapping functionality
- **HTML5 & CSS3** - Modern web standards
- **Vanilla JavaScript** - No framework dependencies
- **Custom CSS Variables** - Consistent theming system

### Key Components
- **Map View**: Interactive 2D map with street basemap
- **Search Widget**: Built-in ArcGIS search functionality
- **Graphics Layer**: Custom markers and symbols
- **Geocoding Service**: Address to coordinate conversion
- **UI Components**: Responsive sidebar and controls

### API Integration
- **ArcGIS World Geocoding Service** - Address search and geocoding
- **ArcGIS Basemaps** - Street vector basemap
- **ArcGIS Search Widget** - Interactive search interface

## 🔧 Configuration

### API Key
The app is configured with an ArcGIS API key for geocoding services:
```javascript
var esriConfig = {
  apiKey: "YOUR_API_KEY_HERE"
};
```

### Default Location
Centered on Seattle, WA with zoom level 12 for good detail.


## 🎯 Use Cases

### Perfect For
- **Address Lookup** - Find and visualize any address
- **Location Planning** - Explore areas and neighborhoods
- **Educational Purposes** - Learn about geographic locations
- **Real Estate** - View property locations and surroundings
- **Travel Planning** - Research destinations and points of interest


## Contributing

This is a personal project showcasing ArcGIS JavaScript API integration with modern web design principles.


## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments
- **Esri** - For the powerful ArcGIS JavaScript API
- **Web Standards** - HTML5, CSS3, and modern JavaScript


**Built with ❤️ using ArcGIS JavaScript API and modern web technologies**

*Last updated: August 2025*
