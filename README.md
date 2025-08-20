# 🗺️ Simple ArcGIS Map Display

A simple web application that displays an interactive map using the ArcGIS Maps SDK for JavaScript, following the official tutorial structure.

## ✨ Features

- **Interactive Map**: Full-screen topographic map
- **Zoom Controls**: Built-in zoom widget
- **Modern ArcGIS SDK**: Uses the latest ArcGIS Maps SDK 4.33
- **Map Components**: Modern web components approach
- **Responsive Design**: Works on all devices

## 🚀 Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection (for ArcGIS API and basemap services)

### Installation

1. **Clone or download** this repository to your local machine
2. **Open** `index.html` in your web browser
3. **Enjoy** the interactive map!

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

## 📖 Usage

The application displays a topographic map centered on the Santa Monica Mountains in California. You can:

- **Zoom in/out** using the zoom controls or mouse wheel
- **Pan around** by clicking and dragging
- **View topographic features** like mountains, valleys, and water bodies

## 🛠️ Technical Details

### Built With

- **ArcGIS Maps SDK 4.33**: Latest version of the JavaScript API
- **Map Components**: Modern web components for easy integration
- **Calcite Design System**: Professional UI components (loaded but not used in this simple version)
- **Topographic Basemap**: Detailed terrain and feature information

### Key Components

- **`<arcgis-map>`**: Main map component with basemap and view settings
- **`<arcgis-zoom>`**: Zoom in/out controls
- **API Key Authentication**: Secure access to ArcGIS services

### API Services Used

- **ArcGIS Basemaps**: Topographic basemap layer
- **ArcGIS Location Platform**: Authentication and services

## 📁 File Structure

```
esri_javascript_app/
├── index.html              # Main HTML file with map
├── sample_coordinates.csv  # Sample CSV file (from previous version)
├── package.json           # Project configuration
└── README.md             # This file
```

## 🔧 Customization

### Changing the Basemap

You can change the basemap by modifying the `basemap` attribute in the `<arcgis-map>` component:

```html
<!-- Streets basemap -->
<arcgis-map basemap="arcgis/streets-vector">

<!-- Satellite basemap -->
<arcgis-map basemap="arcgis/satellite">

<!-- Dark basemap -->
<arcgis-map basemap="arcgis/dark-gray-vector">
```

### Changing the Location

Modify the `center` and `zoom` attributes to change the initial view:

```html
<arcgis-map 
  basemap="arcgis/topographic" 
  center="-74.0060, 40.7128" 
  zoom="10">
```

### Adding More Widgets

You can add additional map widgets:

```html
<arcgis-map basemap="arcgis/topographic" center="-118.805, 34.027" zoom="13">
  <arcgis-zoom position="top-left"></arcgis-zoom>
  <arcgis-search position="top-right"></arcgis-search>
  <arcgis-home position="top-left"></arcgis-home>
  <arcgis-compass position="top-right"></arcgis-compass>
</arcgis-map>
```

## 🧪 Testing

### Test Locations

The map is currently centered on:
- **Location**: Santa Monica Mountains, California
- **Coordinates**: -118.805, 34.027
- **Zoom Level**: 13 (neighborhood level)

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
3. Verify the API key is valid
4. Try refreshing the page if the map doesn't load

## 🔮 Future Enhancements

- [ ] Add search functionality
- [ ] Add layer controls
- [ ] Add drawing tools
- [ ] Add measurement tools
- [ ] Add print functionality
- [ ] Add custom layers

---

**Built with ❤️ using the ArcGIS Maps SDK for JavaScript**

*This project follows the official [Display a map tutorial](https://developers.arcgis.com/javascript/latest/tutorials/display-a-map/) from Esri.*
