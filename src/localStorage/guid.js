const queryString = window.location.search;

const urlParams = new URLSearchParams(queryString);

if (urlParams.get('guid') != null) {
  localStorage.setItem('guid', urlParams.get('guid'));
  history.replaceState({}, document.title, '/');
}

export const guid = localStorage.getItem('guid');
