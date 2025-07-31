function switchLanguage(lang) {
  const currentPath = window.location.pathname;
  // Get the filename, default to 'index.html' if accessing the root
  const filename = currentPath.substring(currentPath.lastIndexOf('/') + 1) || 'index.html';

  let targetPage;

  if (lang === 'zh') {
    // If the current page is not already Chinese, convert the filename
    if (!filename.includes('.zh.html')) {
      targetPage = filename.replace('.html', '.zh.html');
    } else {
      // Already on the Chinese page, no need to navigate
      return;
    }
  } else { // lang === 'en'
    // If the current page is Chinese, convert it back to English
    if (filename.includes('.zh.html')) {
      targetPage = filename.replace('.zh.html', '.html');
    } else {
      // Already on the English page, no need to navigate
      return;
    }
  }

  // Store the user's preference for future visits
  localStorage.setItem('preferredLanguage', lang);
  
  // Navigate to the new page
  window.location.href = targetPage;
}