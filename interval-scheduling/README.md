The primary goal of this project was to explore different scheduling algorithms to maximize the number of non-overlapping events from a randomly generated set of 100 events.

I started by creating a function called ```first_finish```, which selects events based on their end times. This algorithm works by iterating through the list of events and always choosing the event that finishes first, provided it starts after the previously selected event.

Next, I implemented the ```shortest_duration``` function, which prioritizes events based on their durations. The function calculates the duration of each event and selects the shortest one that does not conflict with previously selected events. To determine conflicts, I created the ```isConflict``` function, which checks if a given event overlaps with any of the events already in the schedule.

The third function, ```first_start```, selects events based on their start times. Similar to the first_finish function, it uses a greedy strategy but focuses on the earliest starting events that do not overlap with the current schedule.

To test and compare these algorithms, I generated a set of 100 random events, each with a start time between 7 AM and 6 PM and a duration varying from 30 minutes to 4 hours. I then applied each of the scheduling algorithms to this set of events and printed the number of events successfully scheduled by each method. The ```first_finish``` algorithm was found to always schedule the greatest number of events.

Finally, to visualize the results, I used matplotlib to create a bar chart. Each bar represents an event, with its height corresponding to the event's duration and its position indicating the start time. I color-coded the events selected by the ```first_finish``` algorithm in red, making it easy to see the chosen schedule at a glance.

Through this project, I gained valuable insights into different interval scheduling strategies and their effectiveness in optimizing event schedules. Each algorithm has its strengths and can be applied based on specific requirements and constraints. The visualization component further helped in understanding the distribution and overlap of events, providing a clear picture of how each algorithm performs. Overall, this project enhanced my understanding of greedy algorithms and their application in real-world scheduling problems.

============================================================================================

In order to run this program, you may run the attached Python file through any means you prefer. It will print the number of events scheduled by each algorithm, and display a bar chart visual of ```first_finish```. In order to visualize the events scheduled by ```shortest_duration``` or ```first_start```, you may replace the "```ff_picks```" on line 132 with either "```sd_picks```" or "```fs_picks```".
