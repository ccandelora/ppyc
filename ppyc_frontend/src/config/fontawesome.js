// FontAwesome Configuration for React
import { library } from '@fortawesome/fontawesome-svg-core';
import { config } from '@fortawesome/fontawesome-svg-core';

// Import icons from FontAwesome Free packages
import {
  faHome,
  faUser,
  faBars,
  faTimes,
  faEdit,
  faTrash,
  faPlus,
  faCalendar,
  faCalendarAlt,
  faCalendarDay,
  faEnvelope,
  faPhone,
  faAnchor,
  faUsers,
  faInfoCircle,
  faNewspaper,
  faTv,
  faSpinner,
  faExclamationTriangle,
  faClock,
  faMapMarkerAlt,
  faFileAlt,
  faCheckCircle,
  faFlag,
  faCompass,
  faTrophy,
  faWind,
  faShip,
  faRedo,
  faArrowRight,
  faChevronRight,
  faSearch,
  faDownload,
  faPrint,
  faShare,
  faHeart,
  faStar,
  faMapMarker,
  faSailboat,
  faWater,
  faLifeRing
} from '@fortawesome/free-solid-svg-icons';

// Import social media icons from brands package
import {
  faFacebook,
  faTwitter,
  faInstagram,
  faLinkedin,
  faYoutube
} from '@fortawesome/free-brands-svg-icons';

// Allow FontAwesome to automatically add CSS for React components
config.autoAddCss = true;

// Add icons to the library
library.add(
  faHome,
  faUser,
  faBars,
  faTimes,
  faEdit,
  faTrash,
  faPlus,
  faCalendar,
  faCalendarAlt,
  faCalendarDay,
  faEnvelope,
  faPhone,
  faAnchor,
  faUsers,
  faInfoCircle,
  faNewspaper,
  faTv,
  faSpinner,
  faExclamationTriangle,
  faClock,
  faMapMarkerAlt,
  faFileAlt,
  faCheckCircle,
  faFlag,
  faCompass,
  faTrophy,
  faWind,
  faShip,
  faRedo,
  faArrowRight,
  faChevronRight,
  faSearch,
  faDownload,
  faPrint,
  faShare,
  faHeart,
  faStar,
  faMapMarker,
  faSailboat,
  faWater,
  faLifeRing,
  // Social media icons
  faFacebook,
  faTwitter,
  faInstagram,
  faLinkedin,
  faYoutube
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
  
  // Admin
  EDIT: 'edit',
  DELETE: 'trash',
  ADD: 'plus',
  LOADING: 'spinner',
  WARNING: 'exclamation-triangle',
  TIME: 'clock',
  LOCATION: 'map-marker-alt',
  DOCUMENT: 'file-alt',
  
  // UI
  CHECK: 'check-circle',
  FLAG: 'flag',
  COMPASS: 'compass',
  TROPHY: 'trophy',
  WIND: 'wind',
  SHIP: 'ship',
  SAILBOAT: 'sailboat',
  WATER: 'water',
  LIFE_RING: 'life-ring',
  REFRESH: 'redo',
  
  // Contact
  PHONE: 'phone',
  EMAIL: 'envelope',
  MAP: 'map-marker',
  
  // Actions
  ARROW_RIGHT: 'arrow-right',
  CHEVRON_RIGHT: 'chevron-right',
  SEARCH: 'search',
  DOWNLOAD: 'download',
  PRINT: 'print',
  SHARE: 'share',
  HEART: 'heart',
  STAR: 'star',
  
  // Social Media
  FACEBOOK: 'facebook',
  TWITTER: 'twitter',
  INSTAGRAM: 'instagram',
  LINKEDIN: 'linkedin',
  YOUTUBE: 'youtube'
};

export default library; 