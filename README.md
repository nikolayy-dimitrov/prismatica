# Prismatica - Digital Art Gallery  
[Live Preview](https://prismatica.nikolay-dimitrov.xyz/)

## Overview  
Prismatica is an immersive digital art gallery platform where artists and enthusiasts can showcase, discover, and collect AI-generated and traditional digital artworks. Built with React and TypeScript, powered by Firebase, and enhanced with smooth animations using Framer Motion.

## Features  
- **User Authentication** - Secure signup/login using Firebase Authentication  
- **AI Art Generation** - Integrated DALL-E API for creating unique AI artworks  
- **Artwork Gallery** - Responsive grid layout for browsing digital creations  
- **Collections** - Users can save favorite artworks to personal galleries  
- **Secure Uploads** - Firebase Storage for high-quality image preservation  
- **Real-time Updates** - Firestore-powered content synchronization  
- **Interactive UI** - Smooth animations with Framer Motion  

## Tech Stack  
- **Frontend**: React + TypeScript, Vite, Tailwind CSS, Framer Motion  
- **Backend**: Firebase (Auth/Firestore/Storage), OpenAI DALL-E API  
- **Hosting**: Netlify  

## How to Run Locally  
1. **Clone repository**

```bash
git clone https://github.com/your-username/prismatica.git
cd prismatica
```
2. **Install dependencies:**

```bash
npm install
```
3. **Configure environment variables**
### Create .env file:

```env
VITE_FIREBASE_API_KEY=your-key
VITE_FIREBASE_AUTH_DOMAIN=your-domain
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-bucket
VITE_FIREBASE_APP_ID=your-app-id
VITE_OPENAI_API_KEY=your-openai-key
```
4. **Start development server**

```bash
npm run dev
```
5. **Open in browser**
### Visit
```
http://localhost:5173
```
## Screenshots
### Home Page
<img width="1470" alt="image" src="https://github.com/user-attachments/assets/6a2d123b-1e81-4a68-b7a3-1f7f2ee5c94f" />

### Gallery
<img width="1470" alt="image" src="https://github.com/user-attachments/assets/c42bf6de-7a27-4c86-9e9a-7c6589cd4323" />

### Artboard
<img width="1470" alt="image" src="https://github.com/user-attachments/assets/a6d17892-fff9-470a-b5f0-316a83db519e" />

### AI Art
<img width="1470" alt="image" src="https://github.com/user-attachments/assets/25f02bcb-f91c-458f-b108-a74dc5e2b2c1" />



