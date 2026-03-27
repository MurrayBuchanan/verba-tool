# Frontend Documentation

## Description

The client handles user interaction, audio recording, data visualisation and profile management.

## Project Structure

- `app`
  - `app/_layout.tsx`: Root layout
  - `app/index.tsx`: Entry point
  - `app/(tabs)`
    - `app/(tabs)/_layout.tsx`: Tab navigation layout
    - `app/(tabs)/conversationHistoryScreen.tsx`: Conversation history screen
    - `app/(tabs)/interventionScreen.tsx`: All interventions screen
    - `app/(tabs)/metricsScreen.tsx`: All indicators overview screen
    - `app/(tabs)/recordAudioScreen.tsx`: Audio recording screen
  - `app/conversationScreen`
    - `app/conversationScreen/[id].tsx`: Dynamic route for viewing conversations
  - `app/interventionScreen`
    - `app/interventionScreen/[id].tsx`: Dynamic route for viewing an intervention
  - `app/metricScreen`
    - `app/metricScreen/[id].tsx`: Dynamic route for viewing an indicator
- `components`
  - `...`
- `services`
  - `services/api-service.ts`: Centralised API communication
  - `services/authentication-service.ts`: Authentication
  - `services/intervention-service.ts`: intervention endpoint calls
  - `services/profile-service.ts`: profile endpoint calls
  - `services/transcript-service.ts`: Transcript endpoint calls
  - `services/upload-service.ts`: Audio upload endpoint call
- `hooks`
  - `...`
- `tests`
  - `...`
- `constants`
  - `constants/theme.ts`: Theme configuration
  - `constants/interfaces.ts`: Frontend chemas
  - `constants/metrics.ts`: Indicator display details
- `utils`
  - `utils/chart-grouping.ts`: Chart helpers
  - `utils/chart-rules.ts`: Adapted Nelson's Rules
  - `utils/datetime-formatting.ts`: Formatting for datetimes
  - `utils/form-validation.ts`: Form input validation
- `assets`
  - `...`
- `...`

## Configuration

> [!NOTE]
> If you do not own a developer or Azure account, you can request the original environment variable configurations and your device to added to the researchers developer account.

1. Create `.env file` to store the environment variables

   **Authentication environment variables**
   <br>EXPO_PUBLIC_CLIENT_ID=
   <br>EXPO_PUBLIC_TENANT_ID=
   <br>EXPO_PUBLIC_TENANT_DOMAIN=
   <br>EXPO_PUBLIC_SCHEME= 
   <br>EXPO_PUBLIC_API_URL=
   <br>EXPO_PUBLIC_API_TOKEN=

   <br>View IP for API_URL using `ipconfig getifaddr en0`

2. Install the dependencies

   ```bash
   npm install
   ```

3. Configure the [development build](https://docs.expo.dev/develop/development-builds/introduction/) (required for native libraries)
   1. Login to Expo
      ```bash
      eas login
      ```

   2. Configure the project
      ```bash
      eas build:configure
      ```

   3. Create development build (Select one)
      
      Production Builds ```eas build --platform all```
      iOS Development Build ```eas build --platform ios --profile development```
      Android Development Build ```eas build --platform android --profile development```

## How to run

Once you have configured the project you can run the application.

1. Start the application
   ```bash
   npx expo start
   ```