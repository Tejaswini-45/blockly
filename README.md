# Vehicle Movement Simulator App

This is a frontend-only web application built with React and React-Leaflet that simulates a vehicle moving along a predefined route on an interactive map. The app uses dummy GPS data to animate the vehicle's position and display its traveled path, along with controls and live metadata.

## Features

- Interactive Leaflet map centered on a predefined route.
- Polyline displaying the full route in gray.
- Animated vehicle marker moving smoothly along the route.
- Polyline showing the traveled route in red.
- Play, Pause, and Reset controls for simulation.
- Real-time display of current coordinates, timestamp, and calculated speed.
- Responsive UI styled with Tailwind CSS, works on desktop and mobile.
- Data is sourced from a local JSON file simulating GPS points with timestamps.

## Technologies Used

- React.js for the frontend UI and state management.
- React-Leaflet to integrate Leaflet maps with React.
- Leaflet library for interactive map rendering.
- Tailwind CSS for utility-first styling and responsive layout.
- Local JSON file for dummy GPS route data.

## Getting Started

### Prerequisites

- Node.js and npm installed.

### Installation

1. Clone the repository:

2. Navigate to the project directory:

3. Install dependencies:

## How It Works

- The app fetches the dummy route data (latitude, longitude, timestamp).
- The vehicle marker moves along these points every few seconds.
- The traveled path extends dynamically as the vehicle moves.
- Speed is calculated based on distance and timestamp differences.
- Controls let users start, pause, or reset the simulation.

.
