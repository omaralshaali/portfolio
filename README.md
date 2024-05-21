# Signature Work Portfolio

## COBOL Transaction Processing Program

In this project, I developed a COBOL program to process transaction records stored in a file. The program reads transaction data, performs validation checks, and displays key metrics such as the total number of transactions, the total quantity purchased, and the total cost. The program outputs a detailed report of valid transactions and provides summary statistics at the end. Key features include:

  - Reading and validating transaction data.
  - Handling specific criteria for transaction acceptance (e.g., valid customer IDs, date checks, valid item codes, etc.).
  - Calculating and displaying totals and averages.
  - Managing file input and output operations efficiently.


## Interval Scheduling Algorithms

The interval scheduling program was designed to explore different algorithms for optimizing event scheduling. The main goal was to maximize the number of non-overlapping events from a set of 100 randomly generated events. The project included:

  - First-Finish Algorithm: Selects events based on their earliest finish times, aiming to leave as much room as possible for subsequent events.
  - Shortest-Duration Algorithm: Chooses the shortest events that do not conflict with the already scheduled events, potentially allowing more events to fit into the schedule.
  - First-Start Algorithm: Prioritizes events that start the earliest and do not overlap with current selections, utilizing the earliest available time slots.
  - Visualization of the results using matplotlib, with color-coded bars representing scheduled events.


## Web Development Crime Data Tracker

Crime data collection in St. Paul is an ongoing process managed by the Saint Paul Police Department, with data being updated every 2 to 3 weeks. The dataset includes various categories of incidents such as Homicide, Rape, Robbery, Aggravated Assault, Burglary, Theft, Auto Theft, Arson, Domestic Assaults, Vandalism, Narcotics, and Firearm Discharges, covering incidents from August 14, 2014, to the most recent available date. The data is made publicly accessible through the City of Saint Paul's open information portal. However, it's important to note that the statistics provided are preliminary and subject to change following further investigation. A known issue with the dataset involves time-related data, which is displayed correctly as Central Time in the portal but converts to Coordinated Universal Time (UTC) when exported, leading to a discrepancy of either 5 or 6 hours depending on whether it is Daylight Savings Time or Standard Time. Despite this, the data remains a crucial resource for understanding and addressing crime in St. Paul.

For my Web Development class, my team and I created an interactive Single-Page Application to display crime data in St. Paul. The application leverages three APIs: Leaflet for interactive maps, Nominatim for geocoding, and a custom API we built for accessing crime data, using St. Paul's Crime Incident Report dataset. Using Vue.js as the framework, the app allows users to:

  - View and interact with a map of St. Paul, panning and zooming to different neighborhoods.
  - Enter locations to update the map dynamically.
  - Retrieve and display crime data in a table, filtering the results based on various criteria such as incident type, neighborhood, and date range.
  - Add new crime incidents through a user input form.


Each project involved different technologies and problem-solving approaches, enhancing my skills in collaborative programming, web development, and algorithm design. The COBOL project focused on file processing and business logic, the web development project emphasized interactivity and data visualization, and the interval scheduling project explored algorithmic strategies for optimization.
