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