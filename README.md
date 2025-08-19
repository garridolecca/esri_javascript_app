# 🎯 Tapestry Segmentation Analyzer

A modern web application built with the ArcGIS JavaScript API that allows users to analyze demographic insights using Esri's Tapestry Segmentation data. Users can enter addresses or upload CSV files with coordinates to get detailed demographic reports.

## ✨ Features

- **Address Geocoding**: Enter any address and get instant Tapestry segmentation analysis
- **CSV Batch Processing**: Upload CSV files with coordinates for bulk analysis
- **Interactive Map**: Visualize locations with an interactive ArcGIS map
- **Detailed Reports**: View comprehensive demographic and segmentation data
- **Recent Searches**: Track and reuse previous searches
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Export Functionality**: Export results for further analysis

## 🚀 Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection (for ArcGIS API and geocoding services)
- Optional: ArcGIS Developer Account for enhanced features

### Installation

1. **Clone or download** this repository to your local machine
2. **Open** `index.html` in your web browser
3. **Start analyzing** locations immediately!

### Running Locally

You can run this application using any local web server:

```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (if you have http-server installed)
npx http-server

# Using PHP
php -S localhost:8000
```

Then open `http://localhost:8000` in your browser.

## 📖 Usage Guide

### Address Lookup

1. **Enter an address** in the search box (e.g., "123 Main St, New York, NY")
2. **Click "Search"** or press Enter
3. **View results** in the interactive map and detailed report panel

### CSV Upload

1. **Prepare your CSV file** with the following format:
   ```
   latitude,longitude,description
   40.7128,-74.0060,New York City
   34.0522,-118.2437,Los Angeles
   ```

2. **Upload the file** using the file input
3. **Click "Process CSV"** to analyze all locations
4. **Review batch results** in the results panel

### Understanding Results

The application provides:

- **Tapestry Segments**: Demographic classifications with percentages
- **Demographics**: Key statistics like median age, income, education level
- **Interactive Map**: Visual representation of analyzed locations
- **Recent Searches**: Quick access to previous analyses

## 🛠️ Technical Details

### Built With

- **ArcGIS JavaScript API 4.27**: For mapping and geospatial functionality
- **Vanilla JavaScript**: Modern ES6+ features
- **CSS3**: Responsive design with modern styling
- **HTML5**: Semantic markup

### Key Components

- **Geocoding**: Uses ArcGIS World Geocoding Service
- **Mapping**: Interactive 2D map with custom graphics
- **Data Processing**: Client-side CSV parsing and coordinate validation
- **Local Storage**: Saves recent searches for convenience

### API Services Used

- **ArcGIS World Geocoding Service**: Address to coordinate conversion
- **ArcGIS Basemaps**: Street vector basemap
- **Tapestry Segmentation**: Demographic classification (simulated for demo)

## 📁 File Structure

```
esri_javascript_app/
├── index.html              # Main HTML file
├── styles.css              # CSS styles and responsive design
├── app.js                  # Main JavaScript application
├── sample_coordinates.csv  # Sample CSV file for testing
└── README.md              # This file
```

## 🔧 Customization

### Adding Real Tapestry Data

To connect to real Tapestry Segmentation data:

1. **Get ArcGIS credentials** from [ArcGIS Developer](https://developers.arcgis.com/)
2. **Update the `loadTapestryLayer()` function** in `app.js`
3. **Replace simulated data** in `getTapestryData()` with actual API calls

### Styling Customization

- **Colors**: Modify CSS variables in `styles.css`
- **Layout**: Adjust grid layouts and responsive breakpoints
- **Components**: Customize button styles, panels, and animations

### Adding Features

- **Export functionality**: Implement CSV/JSON export in `exportResults()`
- **Additional demographics**: Extend the data model in `getTapestryData()`
- **Map layers**: Add custom feature layers for enhanced visualization

## 🧪 Testing

### Sample Data

Use the included `sample_coordinates.csv` file to test the CSV upload functionality. It contains coordinates for major US cities.

### Test Addresses

Try these sample addresses:
- "Times Square, New York, NY"
- "Golden Gate Bridge, San Francisco, CA"
- "Disney World, Orlando, FL"

## 📱 Browser Support

- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

For issues or questions:

1. Check the browser console for error messages
2. Ensure you have a stable internet connection
3. Verify your CSV format matches the required structure
4. Try refreshing the page if the map doesn't load

## 🔮 Future Enhancements

- [ ] Real-time Tapestry data integration
- [ ] Advanced filtering and search options
- [ ] Custom map styling and themes
- [ ] Data visualization charts and graphs
- [ ] User accounts and saved analyses
- [ ] API rate limiting and optimization
- [ ] Offline functionality with cached data

---

**Built with ❤️ using the ArcGIS JavaScript API**
