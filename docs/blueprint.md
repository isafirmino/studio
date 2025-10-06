# **App Name**: JuridicoDocs

## Core Features:

- Social Authentication: Allow users to sign in using their Google accounts and store user profiles in Firestore.
- Profile Completion: Guide new users to complete their profiles with necessary information like judging body and role, storing it in Firestore.
- Datajud Integration: Enable users to import legal processes from the Datajud API by entering the process number, which triggers a Cloud Function to fetch metadata and documents.
- Document Storage: Automatically download and store documents associated with imported processes in Cloud Storage for easy access.
- Process Dashboard: Display the user's imported processes in a card format, with real-time filtering and sorting options.
- Process Details: Provide a detailed view of each process, listing associated documents and displaying a summary if available.
- AI-Powered Summarization: Allow users to generate summaries of legal documents using the Ollama API, saving the summary to Firestore. The function orchestrates a call to an external API, so a reasoning tool will be helpful for understanding the request.

## Style Guidelines:

- Primary color: Dark gray (#333333), providing a sophisticated and modern feel.
- Background color: Black (#000000), offering a sleek and professional look.
- Accent color: Teal (#008080), used to highlight key interactive elements and calls to action with a touch of vibrancy.
- Body and headline font: 'Roboto', a sans-serif font ensuring a clean, modern, and easily readable experience on dark backgrounds.
- Use clean, simple, and neon-style icons to represent document types, actions, and process statuses.
- A card-based layout for displaying processes, ensuring a clear and organized presentation on a dark interface.
- Subtle, glowing animations when loading data or transitioning between views, enhancing the user experience with a futuristic touch.