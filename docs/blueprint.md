# **App Name**: StreamChat AI

## Core Features:

- Real-Time Chat Interface: Display a list of chat messages with auto-scrolling, timestamps, and visual distinction between user and AI messages. Includes a text input field with a send button, Enter key support, and input disabling while the AI is responding.
- WebSocket Connection: Establish and manage a WebSocket connection to handle real-time message flow. Includes connection/disconnection state management, status indicators, basic reconnection logic, and graceful error handling.
- Streaming AI Responses: Integrate with a GenAI API (e.g., OpenAI, Anthropic Claude, Google Gemini) to receive and display AI responses in real-time as they are streamed. Display a typing indicator while waiting for the initial chunk.
- Basic State Management: Manage the chat state, including message history (storing and ordering messages), loading indicators, error states, connection status, and input disabled state.

## Style Guidelines:

- Primary color: Deep purple (#6750A4) to convey intelligence and sophistication.
- Background color: Very light gray (#F2F0F7), a desaturated shade of the primary color for a clean, modern look.
- Accent color: Soft lavender (#A394BF), an analogous color to the primary, providing gentle contrast for interactive elements.
- Body and headline font: 'Inter', a grotesque-style sans-serif, suitable for both headlines and body text because of its clean, modern, neutral look.
- Minimalist, line-based icons to represent actions and statuses (e.g., sending, loading, connected, disconnected).
- Clean, readable layout with a responsive design that adapts to different screen sizes. Clear visual separation between user and AI messages.
- Subtle animations for loading indicators, typing animations, and message transitions to enhance user experience.