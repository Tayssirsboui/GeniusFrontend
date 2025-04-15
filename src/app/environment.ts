import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

export const environment = {
    production: false,
    firebaseConfig: {
      apiKey: "AIzaSyA9Weflw-u3RMsJkfL1qSwcdNgvvp42Z4E",
      authDomain: "genius-29303.firebaseapp.com",
      projectId: "genius-29303",
      storageBucket: "genius-29303.firebasestorage.app",
      messagingSenderId: "888730416793",
      appId: "1:888730416793:web:b76505510fafcb1bee2a08",
      measurementId: "G-31WVY658HP",
      vpaikey: "BPR0wVAAMQzcWQDfdDWlAB8D0q2MiVa3q-fYV_SjDJZ8Cvank1on7ch04lYYqwVowmaQPin7SZOJ7E6PdVdR3-o",
    }
  };
  
  const app = initializeApp(environment.firebaseConfig);
  const analytics = getAnalytics(app);
  