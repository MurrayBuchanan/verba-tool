---
sidebar_position: 2
---

# Routing Structure
- Navigation is divided into authenticated and unauthenticated flows to protect the main application screens.
- Dynamic routes are used to render indicator, intervention, and conversation views using an ID to identify the selected resource. 
- Shared states are used to allow nested components to access authentication and active profile data.

![Routing Structure](/img/routing_structure.png)

## Screens
The following screens were created:

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

Additional screens can be added within the `app` directory, and can access and use the authenticated or active profile states to allow for managing user data without requiring additional implementation.