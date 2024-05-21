This project leveraged three APIs: Leaflet for interactive maps, Nominatim for geolocation services, and the St. Paul Crime API my group developed in a previous project. Utilizing Vue.js as the framework, the application became interactive and responsive, enabling users to explore crime data across various neighborhoods in St. Paul.

The development process began with integrating the Leaflet API to display a map of St. Paul. This map allowed users to pan and zoom within the city's boundaries, maintaining a clear focus on the relevant area. We implemented an input box and 'Go' button, enabling users to search for specific locations using either lat/long coordinates or addresses. The map dynamically updated based on user inputs, with the Nominatim API converting between addresses and coordinates. To ensure the map remained user-friendly, we included functionality to clamp input values within St. Paul's bounding box.

Next, we focused on retrieving and displaying crime data from our St. Paul Crime API. The application defaulted to showing the 1,000 most recent crimes, populating a table ordered by recency. We ensured that only crimes within the currently visible map area were displayed, using lat/long coordinates to filter the data accordingly. Additionally, we added markers on the map for each neighborhood, with popups indicating the number of crimes in each area.

One of the critical features was the user input form for adding new crime incidents. This form validated all fields before submitting the data to the API, ensuring the database remained accurate and comprehensive.

To enhance the project's functionality and user experience, we added several advanced features. These included UI controls for filtering crime data by incident type, neighborhood, date range, and maximum number of incidents. This allowed users to customize their data view based on specific criteria. We also implemented background color coding in the table to categorize crimes as violent, property, or other types, complete with a legend for clarity.

Further improvements included adding a delete button for each crime entry, enabling users to remove incidents from the database. Additionally, we added markers to the map for selected crimes, differentiated by color and icon from the neighborhood markers. These markers featured popups with detailed information and a delete option.

Throughout this project, I deepened my understanding of web development, API integration, and interactive application design. The combination of Vue.js, Leaflet, Nominatim, and my custom API allowed me to create a robust, user-friendly tool for exploring crime data in St. Paul, demonstrating the practical applications of these technologies in a real-world context.

============================================================================================

To run this project, you must first download the St. Paul crime incident report data from this link: https://information.stpaul.gov/datasets/stpaul::crime-incident-report/about. Then, navigate to the folder, use ```npm install``` to install all packages, and run the Crime API with ```node .\rest_server.mjs```. 

