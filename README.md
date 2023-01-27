# Watchman
### A solution for managing your microservices

## Problem statement

In the era of microservices world, Every single request will go through umpteen numbers of systems in distributed environment for fulfillment. 
Predicting the cascading application failure in this environment is not easy and we don’t have industry standard solution to pro-actively find/predict the same readily
available in open source world.

#### Primary requirements
  - Find Cascading application failure
  - Find optimal usage of compute
  - Identify the malfunctioning services
  - Visual representation

## HLD of my approach

<img src="https://user-images.githubusercontent.com/74463091/215003245-55310ca6-24e2-4a80-a146-a40e1e37b072.png" height="200px" />

<img src="https://user-images.githubusercontent.com/74463091/215003274-21393320-7769-47b9-b9b1-b8f7725e97f2.png" height="200px" />

<img src="https://user-images.githubusercontent.com/74463091/215003307-cb99fc45-6665-49fb-bb4d-2a3123645e02.png" height="200px" />

<img src="https://user-images.githubusercontent.com/74463091/215003327-342e8e41-a6b1-4b16-aec0-1143aa5667d5.png" height="200px" />

## Implementation of my approach

Created a library that have the code that
- Create a socket server and attach it to an express app(used by monitor service) that sends heartbeat to all the client
- Connect any client to the socket server and acknowledge the heartbeats with relevant data(used by service A and B)
- A middleware that sends all the http request related data to the monitor service(used by service A and B)
- The socket server handles all the necessary payloads coming through different payloads and stores them, and plots the data with timestamps when needed.

## Areas of growth

#### What can be implemented

- The library isn’t very robust and don’t handle all the errors that may come along with it.
- More visualization of different data can be plotted to get a better idea of the resources.
- Other components of the library to take care of outgoing requests as well

#### What can be ideated

- More efficient approach to get out of overloading of servers
- Graph theory based mechanisms and algorithms can be ideated to keep track of inter server communication which can be further utilized to predict any bottlenecks or cascading failure


