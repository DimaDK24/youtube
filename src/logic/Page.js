import { createDivWithClasses } from '../dom/helpers/dom-helpers';
import SearchBar from '../dom/Components/SearchBar/SearchBar';
import Slider from '../dom/Slider';
import {
  getVideoIds,
  addViewsToVideos,
  convertVideos,
  convertViews,
} from './logic-helpers';

const YOUTUBE_KEY = 'AIzaSyAoxmNlzlKwuTNRMvWITXvtFpc-7vqfcr8';
const API_URL = 'https://www.googleapis.com/youtube/v3';

let nextPageToken = '';

async function loadViews(ids) {
  const response = await fetch(`${API_URL}/videos?key=${YOUTUBE_KEY}&type=video&part=statistics&maxResults=15&id=${ids}`,
    { method: 'GET' });
  const message = await response.json();
  return message;
}

async function loadVideos(query) {
  let url = `${API_URL}/search?key=${YOUTUBE_KEY}&type=video&part=snippet&maxResults=15&q=${query}`;
  if (nextPageToken) url += `&pageToken=${nextPageToken}`;
  const response = await fetch(url, { method: 'GET' });
  const message = await response.json();
  // have to suppress it, cause I can't destruct it here
  // eslint-disable-next-line prefer-destructuring
  nextPageToken = message.nextPageToken;
  return message;
}

class Page {
  constructor() {
    this.wrapper = createDivWithClasses('container');
    const searchBar = new SearchBar(this.onStartSearch.bind(this));
    this.wrapper.appendChild(searchBar.element);
    document.body.appendChild(this.wrapper);
    this.loading = false;
  }

  createSlider(videos) {
    this.slider = new Slider(videos, this.onNeedNewVideos.bind(this));
    this.wrapper.appendChild(this.slider.element);
  }

  async onStartSearch(query) {
    if (this.slider) return;
    this.query = query;
    const videos = await this.loadVideosWithViews(query);
    this.createSlider(videos);
  }

  async loadVideosWithViews() {
    this.loading = true;
    const youtubeResponse = await loadVideos(this.query);
    let videos = convertVideos(youtubeResponse.items);
    const ids = getVideoIds(videos);
    const youtubeViews = await loadViews(ids);
    const views = convertViews(youtubeViews.items);
    videos = addViewsToVideos(videos, views);
    this.loading = false;
    return videos;
  }

  async onNeedNewVideos() {
    if (this.loading) return;
    const videos = await this.loadVideosWithViews();
    this.slider.addVideos(videos);
  }
}

export default function page() {
  return new Page();
}
