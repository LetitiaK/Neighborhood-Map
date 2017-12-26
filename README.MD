# Neighborhood Map

This is a single page application featuring a map of Pittsburgh (PA) with several functions including highlighted locations, third-party data about those locations and various ways to browse the content.
In particular, the map displays all sorts of geeky places in and around Pittsburgh. It uses the Google Maps API, the Google StreetView API, the Twitter API, and the Foursquare API to enhance the user experience.

## Getting Started

### Installation Requirements
_Note that the explanations given below are for Windows 7_

* **Bower Package Manager**: Install Bower by opening a terminal and type `npm install -g bower`
* **Knockout.JS**: Install Knockout by opening a terminal and type `bower install knockout`

### Foursquare Developer Account

1. Navigate to the Foursquare Developer Website [here](https://developer.foursquare.com/)
2. Set up a Developer Account or log in
3. Create a new Project
4. Copy the Client ID and the Client Secret
5. Paste the values into the app.js file into the given variables. Check for "**YOUR ID**" and "**YOUR SECRET**"

### Google Developer Account - Optional
1. Navigate to the Google Developer Website [here](https://console.developers.google.com)
2. Create a new project
3. Enable the Google Maps JavaScript API under Google Maps APIs
4. Enable the Google Street View Image API under Google Maps APIs
5. Enable the Google Maps Geocoding API under Google Maps APIs
6. Select "Credentials"
7. Retrieve your API Key
8. Change the given key in the **index.html** file to your API key (The key can be found in the index.html file in line 75)

### Run the Code
Run the code by opening the index.html with a browser

## Troubleshooting

* **The Twitter API does not work correctly**: Please disable the Adblocker in your Browser and refresh the page. The Adbloker often blocks the Twitter Widget from loading correctly.
* **The Foursquare API does not work correctly**: Please make sure that you have entered your Client ID and Client Secret correctly.
