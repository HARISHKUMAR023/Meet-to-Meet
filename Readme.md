# Meet to Meet - Virtual Classroom

Meet to Meet is a virtual classroom application that enables seamless video and audio communication for educational purposes. With Meet to Meet, teachers and students can interact in real-time, conduct lectures, discussions, and collaborative activities remotely.

## Features

- **Real-time Video Communication**: Conduct face-to-face lectures and discussions through video calls.
- **Audio Communication**: Enable audio-only calls for scenarios where video isn't necessary.
- **Screen Sharing**: Share your screen to present slides, documents, or demonstrate software applications.
- **Interactive Whiteboard**: Collaboratively work on a digital whiteboard for drawing diagrams, solving problems, and brainstorming ideas.
- **Chat**: Communicate via text chat for quick questions, announcements, or sharing resources.
- **Participant Management**: Manage participants by muting, removing, or promoting them to moderators.
- **Session Recording**: Record sessions for later playback or sharing with absent students.
- **User Authentication**: Secure access with user authentication to ensure privacy and control over session participants.

## Technologies Used

- **Frontend**: React.js, WebRTC, Socket.IO, HTML5, CSS3
- **Backend**: Node.js, Express.js, Socket.IO
- **Database**: MongoDB
- **Authentication**: JSON Web Tokens (JWT) 
- **Deployment**: Docker, Kubernetes (optional), AWS/GCP/Azure

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/HARISHKUMAR023/Meet-to-Meet
    ```

2. Navigate to the project directory:

    ```bash
    cd meet-to-meet
    ```

3. Install dependencies for both frontend and backend:

    ```bash
    cd client
    npm install
    cd ../server
    npm install
    ```

4. Configure environment variables:

    - Create a `.env` file in the `client` directory and specify frontend environment variables (e.g., API URL).
    - Create a `.env` file in the `server` directory and specify backend environment variables (e.g., MongoDB connection string, JWT secret).

5. Run the development server:

    - Start the frontend:

        ```bash
        cd client
        npm  run dev
        ```

    - Start the backend:

        ```bash
        cd server
        npm start
        ```

6. Access the application:

    Open your web browser and navigate to `http://localhost:3000` to access the Meet to Meet virtual classroom.

## Contributing

Contributions are welcome! Feel free to open issues for feature requests, bug fixes, or any suggestions for improvement. If you'd like to contribute code, please fork the repository and submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
