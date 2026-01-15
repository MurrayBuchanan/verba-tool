# Frontend Documentation

## Description

Content coming soon...

## Project Structure

- `app`
  - `app/_layout.tsx`: Root layout
  - `app/index.tsx`: Entry point
  - `app/(tabs)`: Tab navigation
    - `app/(tabs)/_layout.tsx`: Tab navigation layout
    - `app/(tabs)/conversationHistoryScreen.tsx`: Conversation history screen
    - `app/(tabs)/metricsScreen.tsx`: Metrics overview screen
    - `app/(tabs)/recordAudioScreen.tsx`: Audio recording screen
  - `app/conversationScreen`: View Conversation Screen
    - `app/conversationScreen/[id].tsx`: Dynamic route for conversations
  - `app/metricScreen`: View Metric Screen
    - `app/metricScreen/[id].tsx`: Dynamic route for metrics
- `components`
  - `...`
- `services`
  - `services/authentication-service.ts`: Authentication endpoint calls
  - `services/transcript-service.ts`: Transcript endpoint calls
  - `services/upload-service.ts`: Audio upload to endpoint
- `hooks`
  - `...`
- `constants`
  - `constants/theme.ts`: Theme configuration
  - `constants/transcript.ts`: Transcript interfaces
- `utils`
  - `utils/metric-display.ts`: Metric formatting
- `assets`
  - `...`
- `...`

## Configuration

> [!NOTE]
> If you do not own a developer or Azure account, I can send you my environment variable configurations and add your device to my developer account.

1. Create `.env file` to store the environment variables

   **Authentication environment variables**
   <br>EXPO_PUBLIC_CLIENT_ID=
   <br>EXPO_PUBLIC_TENANT_ID=
   <br>EXPO_PUBLIC_TENANT_DOMAIN=
   <br>EXPO_PUBLIC_SCHEME=

   **API environment variables**
   <br>View IP using `ipconfig getifaddr en0`
   
   <br>EXPO_PUBLIC_API_URL=http://BACKEND_IP:PORT
   <br>EXPO_PUBLIC_API_TOKEN=

2. Install the dependencies

   ```bash
   npm install
   ```

3. Configure the [development build](https://docs.expo.dev/develop/development-builds/introduction/) (required for native libraries)
   1. Login to Expo account
      ```bash
      eas login
      ```
   2. Configure the project
      ```bash
      eas build:configure
      ```
   3. Create development build
      ```bash
      eas build
      ```

## How to run

Once you have configured the project you can run the application.

1. Start the application
   ```bash
   npx expo start
   ```