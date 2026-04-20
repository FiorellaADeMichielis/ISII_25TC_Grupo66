import axios from 'axios';

// Apunta al puerto por defecto de Django
export const api = axios.create({
  baseURL: 'http://localhost:8000/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});

