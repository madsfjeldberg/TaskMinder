# TaskMinder

A simple task management app built with React Native and Firebase.

## Features

- Create and manage multiple task lists
- Add, edit, and delete tasks
- Mark tasks as complete
- Add location data to tasks using interactive maps
- Real-time data synchronization with Firebase

## Future feature plans

- Geofenced tasklists
- Notifications / reminder when you're at one of your tasklists locations
- Authentication using Firebase Auth
- More detailed tasks
- Reminders on tasks, maybe expiration date?

## Technologies Used

- React Native / Expo
- Firebase Firestore
- React Native Maps
- Expo Location

## Getting Started

### Prerequisites

- Node.js
- npm or yarn
- Expo CLI
- Firebase account
- EAS CLI (`npm install -g eas-cli`)
- Expo account

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/TaskMinder.git
cd TaskMinder
```

2. Install dependencies

```bash
npm install
# or
yarn install
```


Since we're using react-native-popup-menu, we have to create a dev build with eas:



### Deployment with EAS

1. Login to your Expo account

```bash
eas login
```

2. Configure your project (if not already configured)

```bash
eas build:configure
```

3. Build for your target platform

```bash
# For Android
eas build --platform android

# For iOS
eas build --platform ios

# For both platforms
eas build --platform all
```

4. Submit to stores (optional)

```bash
# For Android
eas submit --platform android

# For iOS
eas submit --platform ios
```

## Project Structure

- `app/` - Main application screens
- `components/` - Reusable UI components
- `database/` - Firebase configuration and API functions
- `types/` - TypeScript type definitions

## License

This project is licensed under the MIT License.
