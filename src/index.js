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
  // Завантаження зображень
function renderImages(imageData) {
    if (page === 1) {
      gallery.innerHTML = '';
    }
    imageData.hits.forEach((image) => {
      const photoLink = document.createElement('a');
      photoLink.href = image.largeImageURL;
      photoLink.classList.add('photo-card');
  
      const img = document.createElement('img');
      img.src = image.webformatURL;
      img.alt = image.tags;
      img.loading = 'lazy';
  // Змінні для інформації про зображення
      const likes = image.likes;
      const comments = image.comments;
      const downloads = image.downloads;
  // Створення елементів для відображення інформації про зображення
      const detailsContainer = document.createElement('div');
      detailsContainer.classList.add('image-details');
  
      const likesElement = document.createElement('p');
      likesElement.textContent = `Likes: ${likes}`;
  
      const commentsElement = document.createElement('p');
      commentsElement.textContent = `Comments: ${comments}`;
  
      const downloadsElement = document.createElement('p');
      downloadsElement.textContent = `Downloads: ${downloads}`;
  
      detailsContainer.appendChild(likesElement);
      detailsContainer.appendChild(commentsElement);
      detailsContainer.appendChild(downloadsElement);
  
      photoLink.appendChild(img);
      photoLink.appendChild(detailsContainer);
      gallery.appendChild(photoLink);
    });
 // Показ кнопки Load more для підвантаження нових зображень
    if (imageData.totalHits > page * perPage) {
      showLoadMoreButton();
    } else {
      hideLoadMoreButton();
    }
  
    initializeSimpleLightbox();
    smoothScrollToGallery();
  }
  // Бібліотека SimpleLightbox
function initializeSimpleLightbox() {
    lightbox = new SimpleLightbox('.gallery a', {
      captions: true,
      captionDelay: 250,
      fadeSpeed: 250,
      captionSelector: 'img',
      captionsData: 'alt',
      captionPosition: 'bottom',
      close: true,
      closeText: '×',
      nav: true,
      navText: ['←', '→'],
      download: 'Click to download button',
    });
    lightbox.refresh();
  }
  // Пошукова форма
  searchForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const searchQuery = searchForm.querySelector('input[name="searchQuery"]').value.trim();
  
    if (searchQuery === '') {
      Notiflix.Notify.failure('Please enter a search query.');
      return;
    }
  
    page = 1;
  
    try {
      loader.style.display = 'block';
      const imageData = await searchImages(searchQuery);
      loader.style.display = 'none';
  
      if (imageData.hits.length > 0) {
        renderImages(imageData);
        Notiflix.Notify.success(`Hooray! We found ${imageData.totalHits} images.`);
      } else {
        Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
      }
    } catch (error) {
      Notiflix.Notify.failure('Failed to load images. Please try again.');
    }
  });
  // Кнопка Load more 
document.querySelector('.load-more').addEventListener('click', async () => {
    page++;
    const searchQuery = searchForm.querySelector('input[name="searchQuery"]').value.trim();
  
    try {
      loader.style.display = 'block';
      const imageData = await searchImages(searchQuery);
      loader.style.display = 'none';
  
      if (imageData.hits.length > 0) {
        renderImages(imageData);
      } else {
        hideLoadMoreButton();
        Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
      }
    } catch (error) {
      Notiflix.Notify.failure('Failed to load more images. Please try again.');
    }
  });
  // Відображення кнопки Load more
  function showLoadMoreButton() {
    document.querySelector('.load-more').style.display = 'block';
  }
  // Приховання кнопки Load more
  function hideLoadMoreButton() {
    document.querySelector('.load-more').style.display = 'none';
  }
  // Smooth скрол
  function smoothScrollToGallery() {
    const { height: cardHeight } = document.querySelector(".gallery").firstElementChild.getBoundingClientRect();
    window.scrollBy({
      top: cardHeight * 2,
      behavior: "smooth",
    });
  }  
