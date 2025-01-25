# Podify 🎵

Podify is a music streaming platform where users can listen to and manage their favorite tracks. Built using **Node.js**, this project serves as a backend API for handling user authentication, audio uploads, and streaming.

## Features 🚀
- **User Authentication**: Secure login and registration using JWT.
- **Email Verification**: OTP-based email verification for account activation.
- **Audio Streaming**: Upload, retrieve, and stream audio files.
- **Profile Management**: Update user profiles and manage playlists.
- **Scalable Design**: Designed with modular architecture for easy scalability.

## Technologies Used 🛠️
- **Node.js**: Backend server
- **TypeScript**: Typed JavaScript for better reliability
- **Express.js**: Framework for building RESTful APIs
- **MongoDB**: NoSQL database
- **AWS SDK**: For managing file uploads to AWS S3
- **Yup**: Schema validation
- **Bcrypt**: Password hashing
- **JWT**: Token-based authentication

## Installation & Setup ⚙️
1. Clone the repository:
   ```bash
   git clone https://github.com/MonishReddyDev/podify-project.git
   cd podify-project

2. Install dependencies:

  ```bash
  npm install
```

3. Set up environment variables: Create a .env file in the root directory with the following:

  ```bash
  DB_URL=<your_mongo_db_url>
  JWT_SECRET=<your_jwt_secret>
  AWS_ACCESS_KEY_ID=<your_aws_access_key>
  AWS_SECRET_ACCESS_KEY=<your_aws_secret_key>
```

4. Start the server
   Development
   ```bash
   npm run dev
   ```
   Production
    ```bash
   npm start
   ```
Access the API  ```http://localhost:3000 ``` in your browser or API client.
    
   
   


