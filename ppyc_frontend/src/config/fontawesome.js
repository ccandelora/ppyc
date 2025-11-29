// FontAwesome Configuration for React with Premium Kit
// The FontAwesome kit is loaded via script tag in index.html
// This configuration enables React components to use the globally available icons

import { config, library } from '@fortawesome/fontawesome-svg-core';

// Configure FontAwesome to work with the kit
config.autoAddCss = true; // Let React handle CSS for components
config.searchPseudoElements = false; // Kit handles pseudo elements

// Since we're using a kit, we need to tell the library about the icons
// The kit provides icons globally, but React needs them in the library
// This is a workaround to make React components work with the kit

// We'll add the icons by name to the library so React can find them
import { 
  faHome, faUser, faBars, faTimes, faEdit, faTrash, faPlus, 
  faCalendar, faCalendarAlt, faCalendarDay, faEnvelope, faPhone, 
  faAnchor, faUsers, faInfoCircle, faNewspaper, faTv, faSpinner, 
  faExclamationTriangle, faClock, faMapMarkerAlt, faFileAlt, 
  faCheckCircle, faFlag, faCompass, faTrophy, faWind, faShip, 
  faRedo, faArrowRight, faChevronRight, faSearch, faDownload, 
  faPrint, faShare, faHeart, faStar, faMapMarker, faWater, 
  faLifeRing, faShieldAlt, faUtensils, faBroadcastTower, 
  faCloud, faCloudRain, faSnowflake, faBolt, faSmog, faSun, 
  faWaveSquare, faDroplet, faThermometerHalf, faImages, 
  faCloudUploadAlt, faFolderOpen, faSyncAlt, faTh, faList, 
  faCopy, faCheck, faVideo, faChevronLeft, faChevronDown, 
  faEllipsisH, faLayerGroup, faImage, faTachometerAlt, 
  faDesktop, faCog, faPhotoVideo, faChevronUp, faSignOutAlt, 
  faSignInAlt, faExternalLinkAlt, faBullhorn, faCrown, 
  faUserShield, faLock, faSave, faBook, faSailboat,
  faHeading, faAlignLeft
} from '@fortawesome/free-solid-svg-icons';

import { 
  faFacebook, faTwitter, faInstagram, faLinkedin, faYoutube 
} from '@fortawesome/free-brands-svg-icons';

// Add icons to library so React can find them
library.add(
  faHome, faUser, faBars, faTimes, faEdit, faTrash, faPlus, 
  faCalendar, faCalendarAlt, faCalendarDay, faEnvelope, faPhone, 
  faAnchor, faUsers, faInfoCircle, faNewspaper, faTv, faSpinner, 
  faExclamationTriangle, faClock, faMapMarkerAlt, faFileAlt, 
  faCheckCircle, faFlag, faCompass, faTrophy, faWind, faShip, 
  faRedo, faArrowRight, faChevronRight, faSearch, faDownload, 
  faPrint, faShare, faHeart, faStar, faMapMarker, faWater, 
  faLifeRing, faShieldAlt, faUtensils, faBroadcastTower, 
  faCloud, faCloudRain, faSnowflake, faBolt, faSmog, faSun, 
  faWaveSquare, faDroplet, faThermometerHalf, faImages, 
  faCloudUploadAlt, faFolderOpen, faSyncAlt, faTh, faList, 
  faCopy, faCheck, faVideo, faChevronLeft, faChevronDown, 
  faEllipsisH, faLayerGroup, faImage, faTachometerAlt, 
  faDesktop, faCog, faPhotoVideo, faChevronUp, faSignOutAlt, 
  faSignInAlt, faExternalLinkAlt, faBullhorn, faCrown, 
  faUserShield, faLock, faSave, faBook, faSailboat,
  faHeading, faAlignLeft,
  faFacebook, faTwitter, faInstagram, faLinkedin, faYoutube
);

// Icon name mapping for easy reference
export const ICON_NAMES = {
  // Navigation
  HOME: 'home',
  USER: 'user',
  MENU: 'bars',
  CLOSE: 'times',
  INFO: 'info-circle',
  NEWS: 'newspaper',
  CALENDAR: 'calendar',
  CALENDAR_ALT: 'calendar-alt',
  CALENDAR_DAY: 'calendar-day',
  ANCHOR: 'anchor',
  USERS: 'users',
  TV: 'tv',
  
  // Contact & Location
  ENVELOPE: 'envelope',
  PHONE: 'phone',
  LOCATION: 'map-marker-alt',

  // Weather Icons
  SUN: 'sun',
  CLOUD: 'cloud',
  RAIN: 'cloud-rain',
  SNOW: 'snowflake',
  THUNDER: 'bolt',
  WIND: 'wind',
  FOG: 'smog',
  WATER: 'water',
  WAVE: 'wave-square',
  DROPLET: 'droplet',
  THERMOMETER: 'thermometer-half',
  COMPASS: 'compass',
  WARNING: 'exclamation-triangle',
  LOADING: 'spinner',

  // Admin & Security
  SHIELD: 'shield-alt',
  EDIT: 'edit',
  DELETE: 'trash',
  ADD: 'plus',
  CHECK: 'check',
  CHECK_CIRCLE: 'check-circle',
  FLAG: 'flag',
  TROPHY: 'trophy',
  SHIP: 'ship',
  REDO: 'redo',
  ARROW_RIGHT: 'arrow-right',
  CHEVRON_RIGHT: 'chevron-right',
  SEARCH: 'search',
  DOWNLOAD: 'download',
  PRINT: 'print',
  SHARE: 'share',
  HEART: 'heart',
  STAR: 'star',
  MAP_MARKER: 'map-marker',
  LIFE_RING: 'life-ring',
  UTENSILS: 'utensils',
  BROADCAST_TOWER: 'broadcast-tower',
  CLOCK: 'clock',
  SAILBOAT: 'sailboat',

  // Media Library
  IMAGES: 'images',
  CLOUD_UPLOAD: 'cloud-upload-alt',
  FOLDER_OPEN: 'folder-open',
  SYNC: 'sync-alt',
  GRID: 'th',
  LIST: 'list',
  COPY: 'copy',
  VIDEO: 'video',
  CHEVRON_LEFT: 'chevron-left',
  CHEVRON_DOWN: 'chevron-down',
  ELLIPSIS: 'ellipsis-h',
  LAYER_GROUP: 'layer-group',
  IMAGE: 'image',

  // Additional Admin
  DASHBOARD: 'tachometer-alt',
  DESKTOP: 'desktop',
  SETTINGS: 'cog',
  MEDIA: 'photo-video',
  CHEVRON_UP: 'chevron-up',
  SIGN_OUT: 'sign-out-alt',
  SIGN_IN: 'sign-in-alt',
  EXTERNAL_LINK: 'external-link-alt',
  ANNOUNCEMENT: 'bullhorn',
  CROWN: 'crown',
  USER_SHIELD: 'user-shield',
  LOCK: 'lock',
  SAVE: 'save',
  BOOK: 'book',

  // Social Media
  FACEBOOK: ['fab', 'facebook'],
  TWITTER: ['fab', 'twitter'],
  INSTAGRAM: ['fab', 'instagram'],
  LINKEDIN: ['fab', 'linkedin'],
  YOUTUBE: ['fab', 'youtube'],

  // Premium Icons - Add more as needed
  // With your premium kit, you now have access to:
  // - Pro solid icons (fas)
  // - Pro regular icons (far)
  // - Pro light icons (fal)
  // - Pro thin icons (fat)
  // - Pro duotone icons (fad)
  // - Sharp solid icons (fass)
  // - Sharp regular icons (fasr)
  // - Sharp light icons (fasl)
  // - Sharp thin icons (fast)
  // - Sharp duotone icons (fasd)
  // - Brands icons (fab)
  
  // Examples of premium icon styles:
  // LIGHT_HOME: ['fal', 'home'],
  // THIN_USER: ['fat', 'user'],
  // DUOTONE_ANCHOR: ['fad', 'anchor'],
  // SHARP_SHIP: ['fass', 'ship'],
}; 