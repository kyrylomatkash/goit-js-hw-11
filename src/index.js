// Імпорт бібліотек
import axios from "axios";
import Notiflix from "notiflix";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
// Ключ
const pixabayAPIKey = "34349761-3a6c23f95a8981b52fe6e345c";
// Основні змінні
const searchForm = document.querySelector('#search-form');
const loader = document.querySelector('.search-loader');
const gallery = document.querySelector('.gallery');
let page = 1;
const perPage = 40;
let lightbox;
// Пошук зображень
async function searchImages(query) {
    try {
      loader.style.display = 'block';
      
      const response = await axios.get('https://pixabay.com/api/', {
      // Параметри Pixabay API
        params: {
          key: pixabayAPIKey,
          q: query,
          image_type: 'photo',
          orientation: 'horizontal',
          safesearch: true,
          page: page,
          per_page: perPage,
          image_details: true,
        }
      });
  
      loader.style.display = 'none';
      return response.data;
    } catch (error) {
      loader.style.display = 'none';
      throw error;
    }
  }