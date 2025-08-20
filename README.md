# 🗺️ ArcGIS Data Enrichment App - Tapestry Segmentation

A modern web application that allows users to enter a ZIP code and get detailed demographic insights and Tapestry segmentation data using the ArcGIS GeoEnrichment service.

## ✨ Features

- **ZIP Code Analysis**: Enter any US ZIP code to get demographic data
- **Tapestry Segmentation**: View detailed lifestyle and demographic classifications
- **Interactive Map**: Visualize locations with an interactive ArcGIS map
- **Beautiful Cards**: Clean, modern UI with organized data presentation
- **Real-time Data**: Uses ArcGIS GeoEnrichment service for live data
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

## 🚀 Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection (for ArcGIS API and GeoEnrichment services)
- ArcGIS API key (already configured)

### Installation

1. **Clone or download** this repository to your local machine
2. **Open** `index.html` in your web browser
3. **Enter a ZIP code** to start analyzing!

### Running Locally

You can run this application using any local web server:

```bash
# Using Python 3
python -m http.server 8000

# Using PHP
php -S localhost:8000
```

Then open `http://localhost:8000` in your browser.

**Note**: Simply opening `index.html` directly in your browser will also work!

## 📖 Usage

### How to Use the App

1. **Enter a ZIP Code**: Type any 5-digit US ZIP code in the input field
2. **Click "Analyze ZIP Code"**: The app will fetch demographic data from ArcGIS
3. **View Results**: See detailed demographics and Tapestry segmentation in a beautiful card format
4. **Explore the Map**: Use the interactive map to visualize the location

### What Data You Get

- **Total Population**: Number of people in the ZIP code area
- **Median Age**: Average age of residents
- **Median Income**: Average household income
- **Home Ownership Rate**: Percentage of homeowners vs renters
- **Tapestry Segments**: Detailed lifestyle and demographic classifications

## 🛠️ Technical Details

### Built With

- **ArcGIS Maps SDK 4.33**: Latest version of the JavaScript API
- **ArcGIS GeoEnrichment Service**: For demographic and Tapestry data
- **Map Components**: Modern web components for easy integration
- **Vanilla JavaScript**: Clean, modern ES6+ code
- **CSS3**: Responsive design with modern styling

### Key Components

- **GeoEnrichment API**: Fetches real demographic data from ArcGIS
- **ZIP Code Validation**: Ensures valid 5-digit ZIP codes
- **Data Formatting**: Beautiful presentation of numbers, currency, and percentages
- **Error Handling**: Graceful handling of API errors and invalid inputs

### API Services Used

- **ArcGIS GeoEnrichment Service**: Demographic and Tapestry segmentation data
- **ArcGIS Basemaps**: Street vector basemap
- **ArcGIS Location Platform**: Authentication and services

## 📁 File Structure

```
esri_javascript_app/
├── index.html              # Main HTML file with app functionality
└── README.md              # This file
```

## 🔧 How It Works

### Data Enrichment Process

1. **User Input**: User enters a 5-digit ZIP code
2. **Validation**: App validates the ZIP code format
3. **API Request**: Sends request to ArcGIS GeoEnrichment service
4. **Data Processing**: Extracts demographic and Tapestry data
5. **Display**: Shows results in a beautiful card format

### GeoEnrichment Request

The app uses the [ArcGIS GeoEnrichment service](https://developers.arcgis.com/documentation/mapping-and-location-services/data-enrichment/how-to-build-a-data-enrichment-app/) with:

- **Study Area**: ZIP code boundary using `US.ZIP5` layer
- **Data Collections**: 
  - `KeyUSFacts` - Basic demographic information
  - `US.TapestrySegmentation` - Tapestry lifestyle segments
- **Response Processing**: Extracts and formats the returned data

## 🧪 Testing

### Sample ZIP Codes

Try these ZIP codes to test the functionality:

- **90210** - Beverly Hills, CA (High-income area)
- **10001** - New York, NY (Urban area)
- **33101** - Miami, FL (Downtown area)
- **60601** - Chicago, IL (Downtown area)
- **75201** - Dallas, TX (Downtown area)

### Expected Results

Each ZIP code will show:
- Population demographics
- Income statistics
- Home ownership rates
- Tapestry segmentation data (if available)

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
3. Verify the ZIP code is valid (5 digits)
4. Try refreshing the page if the app doesn't load

## 🔮 Future Enhancements

- [ ] Add address geocoding functionality
- [ ] Add CSV batch processing for multiple ZIP codes
- [ ] Add data visualization charts
- [ ] Add export functionality (PDF/CSV)
- [ ] Add comparison between ZIP codes
- [ ] Add historical data trends
- [ ] Add custom data collections

## 📚 Resources

- [ArcGIS GeoEnrichment Service Documentation](https://developers.arcgis.com/documentation/mapping-and-location-services/data-enrichment/how-to-build-a-data-enrichment-app/)
- [Tapestry Segmentation Overview](https://www.esri.com/en-us/arcgis/products/tapestry-segmentation/overview)
- [ArcGIS Maps SDK for JavaScript](https://developers.arcgis.com/javascript/)

---

**Built with ❤️ using the ArcGIS Maps SDK for JavaScript and GeoEnrichment Service**

*This project demonstrates real-world usage of ArcGIS data enrichment capabilities for demographic analysis.*
