/**
 * Utility for efficiently loading third-party scripts
 * Includes caching, error handling, and performance optimizations
 */

// Cache for loaded scripts to prevent duplicate loading
const scriptCache = new Map();

/**
 * Load a script dynamically with caching
 * @param {string} src - Script URL
 * @param {Object} options - Loading options
 * @returns {Promise} Promise that resolves when script is loaded
 */
export const loadScript = (src, options = {}) => {
  const {
    async = true,
    defer = false,
    crossorigin = null,
    integrity = null,
    id = null,
    timeout = 10000, // 10 second timeout
    retries = 2
  } = options;

  // Check if script is already loaded or loading
  if (scriptCache.has(src)) {
    return scriptCache.get(src);
  }

  const scriptPromise = new Promise((resolve, reject) => {
    // Check if script already exists in DOM
    const existingScript = document.querySelector(`script[src="${src}"]`);
    if (existingScript) {
      resolve(existingScript);
      return;
    }

    // Create new script element
    const script = document.createElement('script');
    script.src = src;
    script.async = async;
    script.defer = defer;
    
    if (crossorigin) script.crossOrigin = crossorigin;
    if (integrity) script.integrity = integrity;
    if (id) script.id = id;

    // Set up timeout
    const timeoutId = setTimeout(() => {
      script.remove();
      reject(new Error(`Script loading timeout: ${src}`));
    }, timeout);

    // Handle successful load
    script.onload = () => {
      clearTimeout(timeoutId);
      resolve(script);
    };

    // Handle errors
    script.onerror = () => {
      clearTimeout(timeoutId);
      script.remove();
      reject(new Error(`Failed to load script: ${src}`));
    };

    // Add to document
    document.head.appendChild(script);
  });

  // Add retry logic
  const retriedPromise = scriptPromise.catch(async (error) => {
    if (retries > 0) {
      console.warn(`Retrying script load: ${src}. Retries left: ${retries}`);
      // Wait a bit before retrying
      await new Promise(resolve => setTimeout(resolve, 1000));
      return loadScript(src, { ...options, retries: retries - 1 });
    }
    throw error;
  });

  // Cache the promise
  scriptCache.set(src, retriedPromise);
  
  return retriedPromise;
};

/**
 * Load multiple scripts in parallel
 * @param {Array} scripts - Array of script URLs or objects with src and options
 * @returns {Promise} Promise that resolves when all scripts are loaded
 */
export const loadScripts = (scripts) => {
  const promises = scripts.map(script => {
    if (typeof script === 'string') {
      return loadScript(script);
    }
    return loadScript(script.src, script.options);
  });
  
  return Promise.all(promises);
};

/**
 * Preload a script for faster loading later
 * @param {string} src - Script URL
 */
export const preloadScript = (src) => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'script';
  link.href = src;
  document.head.appendChild(link);
};

/**
 * Load script when user interacts or after delay
 * @param {string} src - Script URL
 * @param {Object} options - Loading options
 * @returns {Promise} Promise that resolves when script is loaded
 */
export const loadScriptOnInteraction = (src, options = {}) => {
  const { events = ['click', 'keydown', 'touchstart'], delay = 3000 } = options;
  
  return new Promise((resolve, reject) => {
    let loaded = false;
    
    const load = () => {
      if (loaded) return;
      loaded = true;
      
      // Remove event listeners
      events.forEach(event => {
        document.removeEventListener(event, load, { passive: true });
      });
      
      loadScript(src, options).then(resolve).catch(reject);
    };
    
    // Load on user interaction
    events.forEach(event => {
      document.addEventListener(event, load, { passive: true, once: true });
    });
    
    // Load after delay as fallback
    setTimeout(load, delay);
  });
};

/**
 * Check if a script is already loaded
 * @param {string} src - Script URL
 * @returns {boolean} True if script is loaded
 */
export const isScriptLoaded = (src) => {
  return document.querySelector(`script[src="${src}"]`) !== null;
};

/**
 * Remove a script from cache and DOM
 * @param {string} src - Script URL
 */
export const removeScript = (src) => {
  const script = document.querySelector(`script[src="${src}"]`);
  if (script) {
    script.remove();
  }
  scriptCache.delete(src);
}; 