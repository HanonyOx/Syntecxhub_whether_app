Weather App

A responsive weather application built with HTML, CSS, and JavaScript that provides current weather conditions, hourly forecasts, and a 7-day forecast for searched cities or the user's current location.

This project was completed as part of my Syntecxhub internship, where I worked on building practical frontend projects and strengthening my understanding of JavaScript, API integration, DOM manipulation, responsive design, and browser APIs.

🚀 Live Features

The Weather App allows users to:

🔍 Search for a city and view its weather
📍 Use their current location to get local weather
🌡️ Switch between Celsius and Fahrenheit
☀️ Display current weather conditions
💧 View humidity
🌬️ View wind speed
🌡️ View the "feels like" temperature
☀️ View today's UV index
🕐 View the next 24 hours of weather
📅 View a 7-day forecast
🌧️ View precipitation probability
🌈 Dynamically change the background based on weather conditions
📱 Use the application on different screen sizes
♿ Use accessible labels and keyboard focus states
🧑‍💻 Internship Project

This project was developed during my Syntecxhub internship as part of my practical frontend development work.

The project gave me an opportunity to move beyond static interfaces and work with:

JavaScript
DOM manipulation
Asynchronous JavaScript
Fetch API
External APIs
Geolocation
Dynamic UI rendering
Responsive CSS
Error handling
Fallback data
Accessibility

It also helped me understand how a frontend application communicates with an external API and transforms the returned data into a usable interface.

🛠️ Technologies Used
HTML5

Used to structure the application.

The project uses semantic elements such as:

<main>
<form>
<section>
<h2>
<input>
<button>

Accessibility attributes such as aria-label and role="status" are also used where appropriate.

CSS3

CSS is responsible for the visual appearance and responsiveness of the application.

Some of the CSS concepts used include:

CSS variables
Flexbox
CSS Grid
Media queries
Responsive typography
Gradients
Transitions
Pseudo-classes
clamp()
auto-fit
minmax()
Custom data attributes

The application also uses CSS variables to dynamically change the background theme depending on the weather.

For example:

Clear weather
      ↓
clear theme

Rain
      ↓
rain theme

Snow
      ↓
snow theme

Storm
      ↓
storm theme
JavaScript

JavaScript handles the application's functionality and interaction.

It is responsible for:

Searching for cities
Calling APIs
Processing weather data
Rendering weather information
Handling user interactions
Switching temperature units
Using browser geolocation
Handling errors
Generating fallback/demo data
🌐 APIs Used

The application uses the Open-Meteo API for weather and geocoding data.

Open-Meteo Weather API

The weather endpoint provides information such as:

Current temperature
Apparent temperature
Relative humidity
Weather condition code
Wind speed
Hourly temperature
Hourly weather conditions
Daily maximum temperature
Daily minimum temperature
Precipitation probability
UV index

The application requests both current and forecast information from the API.

Open-Meteo Geocoding API

When a user searches for a city, the application first converts the city name into geographic coordinates.

The flow is:

User searches for city
        ↓
Geocoding API
        ↓
City information
        ↓
Latitude + Longitude
        ↓
Weather API
        ↓
Weather data
        ↓
UI

For example, if the user searches for:

London

the application retrieves London's latitude and longitude and then uses those coordinates to request its weather information.

🧠 How the Application Works

The application follows a simple data flow.

              User
                │
        ┌───────┴────────┐
        ↓                ↓
   Search City       Use Location
        │                │
        ↓                ↓
  Geocoding API      Browser API
        │                │
        └───────┬────────┘
                ↓
        Latitude + Longitude
                ↓
         Weather API
                ↓
          Weather Data
                ↓
             State
                ↓
            render()
                ↓
          Weather UI
🔍 City Search

When a user enters a city name, the application listens for the form submission.

The default browser form submission is prevented so that the page does not reload.

The application then:

Gets the value entered by the user.
Removes unnecessary whitespace.
Sends the city name to the geocoding API.
Gets the city's coordinates.
Sends those coordinates to the weather API.
Stores the returned weather data.
Renders the information on the page.
Search flow
Search "Lagos"
       ↓
Geocoding API
       ↓
Lagos coordinates
       ↓
Weather API
       ↓
Current + hourly + daily weather
       ↓
Display results
📍 Current Location

The application also supports browser geolocation.

When the user clicks the location button, the application checks whether the browser supports geolocation.

If it does, it requests the user's location.

User clicks 📍
      ↓
navigator.geolocation
      ↓
Latitude + Longitude
      ↓
Weather API
      ↓
Current location weather

The browser will request permission from the user before providing the location.

If permission is denied, the application displays a message asking the user to search for a city instead.

🌡️ Temperature Units

The application supports:

Celsius (°C)
Fahrenheit (°F)

The default unit is Celsius.

The application stores the selected unit in its state.

When the user switches units, the weather data does not need to be requested again.

Instead, the application converts the existing Celsius temperature.

Celsius → Fahrenheit
°F = °C × 9/5 + 32

The same idea is used for wind speed:

km/h → mph

This makes the unit switch fast because it doesn't require another API request.

🌦️ Weather Condition Mapping

Weather APIs generally return numerical weather codes rather than human-readable descriptions.

For example:

0 → Clear
2 → Partly cloudy
3 → Overcast
61 → Rain
71 → Snow
95 → Thunderstorm

The application has a describe() function that converts these codes into:

Weather code
      ↓
Description
      ↓
Icon
      ↓
Background theme

For example:

61
 ↓
Rain
 ↓
🌧️
 ↓
rain theme

This allows the UI to show a meaningful description instead of simply displaying the API's numerical code.

🎨 Dynamic Weather Themes

The background of the application changes depending on the current weather.

The application uses the data-sky attribute on the <body> element.

Examples include:

clear
clear-night
cloud
rain
snow
storm
fog

JavaScript determines the current weather theme and updates the body's attribute.

CSS then uses that attribute to apply the appropriate colors.

Example flow
Weather code
     ↓
describe()
     ↓
"Rain"
     ↓
data-sky="rain"
     ↓
Rain background

This allows the interface to visually respond to the current weather.

🕐 Next 24 Hours

The application displays an hourly forecast for the next 24 hours.

It uses the hourly data returned by the weather API.

The application first finds the current hour and then displays up to the next 24 hourly entries.

Each hourly card displays:

Time
Weather icon
Temperature

The current hour is displayed as:

Now

instead of displaying the actual time.

📅 7-Day Forecast

The application also displays a seven-day forecast.

Each day contains information such as:

Day name
Weather icon
Precipitation probability
Temperature range

The first day is displayed as:

Today

while the remaining days use abbreviated weekday names.

📊 Temperature Range Visualization

The daily forecast includes a visual temperature range bar.

The application finds:

Lowest temperature across the forecast
Highest temperature across the forecast

It then calculates the relative position and width of each day's temperature range.

This allows the forecast to visually communicate how the day's temperatures compare with the rest of the week.

📦 Application State

The application keeps its main data in a simple JavaScript state object.

The state contains:

place
data
unit
place

Stores the location currently being displayed.

data

Stores the weather information returned from the API.

unit

Stores the current temperature unit:

"C"

or

"F"

Whenever the state changes, the render() function updates the UI.

🔄 Rendering

The render() function is responsible for taking the stored weather data and displaying it on the page.

It updates:

Location
Temperature
Weather condition
Weather icon
Weather theme
Humidity
Wind speed
UV index
Hourly forecast
7-day forecast

The general idea is:

API Data
   ↓
state.data
   ↓
render()
   ↓
DOM
   ↓
User Interface
⚠️ Error Handling & Fallback Data

The application also handles API failures.

If the weather API cannot be reached, the application does not simply leave the page blank.

Instead, it uses a demoData() function to generate sample weather information.

The user is also informed that sample data is being displayed.

API request
    ↓
Successful?
   / \
 Yes  No
 ↓     ↓
Real   Demo
data   data

This makes the application more resilient when the external weather service is unavailable.

📱 Responsive Design

The application is designed to work across different screen sizes.

Some of the responsive techniques used include:

Flexible layouts
Flexbox
CSS Grid
auto-fit
minmax()
clamp()
Horizontal scrolling for hourly forecasts
Responsive spacing and typography

For example, the temperature uses:

clamp()

so that its font size can adapt to different screen sizes.

The hourly forecast can also scroll horizontally on smaller screens instead of forcing all 24 hours into a single row.

♿ Accessibility

Some accessibility considerations included in the project are:

aria-label on controls
role="status" for status messages
Semantic HTML elements
Visible keyboard focus states
Descriptive placeholder text
Reduced-motion support

The application also includes:

@media (prefers-reduced-motion: reduce)

to reduce animations for users who have enabled reduced motion in their operating system.

📁 Project Structure
weather-app/
│
├── index.html
├── style.css
├── script.js
└── README.md
index.html

Contains the structure of the application, including:

Search form
Location button
Unit switcher
Current weather section
Weather statistics
Hourly forecast
7-day forecast
style.css

Contains all styling and responsive design rules.

script.js

Contains:

API requests
Weather processing
State management
DOM manipulation
Geolocation
Unit conversion
Weather-code mapping
Forecast rendering
Error handling
Demo data
README.md

Contains the project documentation.

🧩 Important JavaScript Concepts Used

This project helped me practice several JavaScript concepts.

DOM Manipulation

The application selects and updates HTML elements dynamically.

For example:

HTML element
     ↓
JavaScript
     ↓
Update content
     ↓
New information appears
Fetch API

The application uses fetch() to communicate with external APIs.

JavaScript
    ↓
fetch()
    ↓
API
    ↓
Response
    ↓
JSON
    ↓
Application
Async/Await

The weather and geocoding requests are asynchronous.

async/await makes it easier to work with these operations and handle their results.

Array Methods

The project makes use of array methods such as:

.map()
.findIndex()
.forEach()

For example, .map() is used to transform forecast data into HTML elements for display.

Template/Dynamic Rendering

The application generates parts of the UI dynamically based on the returned weather data rather than hardcoding every forecast item.

🔐 Error Handling

The application checks whether API requests are successful.

If an API request returns an unsuccessful response, an error is generated and handled by the application.

Different situations provide different user messages, such as:

Searching…
Loading weather…
No city found
Search failed
Location access was blocked

This provides feedback instead of leaving the user wondering whether the application is working.

🎯 What I Learned

Working on this project helped me understand how a frontend application works beyond just creating the interface.

Some of the main things I learned include:

Working with external APIs
Using the Fetch API
Handling asynchronous operations
Using async/await
Working with JSON responses
Manipulating the DOM
Managing application state with JavaScript
Using browser geolocation
Handling API errors
Creating fallback data
Building responsive layouts
Working with CSS variables
Dynamically changing UI themes
Converting and processing API data
Thinking about accessibility when building interfaces

Most importantly, I learned how to take data from an external service, process it, and turn it into something useful and understandable for a user.

💡 Challenges

One of the main challenges in the project was understanding how to work with an external API and transform its response into the structure needed by the interface.

The API does not return information exactly in the format that the UI needs.

For example:

API
 ↓
weather_code: 61

The application needs to turn that into:

Rain
🌧️
rain theme

Another challenge was handling different states of the application, such as:

Loading
Successful response
Failed response
No city found
Location permission denied

This helped me understand the importance of handling both successful and unsuccessful user flows.

🚀 Future Improvements

Some features that could be added in future versions include:

🌍 More detailed location information
🔎 Better city search suggestions
⭐ Favorite cities
💾 Persistent user preferences
🌙 More advanced weather animations
📊 Additional weather statistics
🌧️ More detailed precipitation information
🌅 Sunrise and sunset information
🗺️ Weather maps
📱 Installable PWA support
🌐 Improved offline functionality
🎨 Additional weather themes
👨‍💻 Author

Anthony Omeh

Frontend Developer | Computer Science Student

This project was developed as part of my Syntecxhub internship.

📌 Project Purpose

This project was built as a practical frontend development exercise to demonstrate my ability to:

Build an interactive web application, consume external APIs, process dynamic data, and create a responsive user interface using HTML, CSS, and JavaScript.

⭐ Acknowledgement

Weather data and geocoding functionality are provided through the Open-Meteo API.

The project was developed for learning and internship purposes as part of my Syntecxhub internship experience.