document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const countrySelect = document.getElementById('countrySelect');
    const categorySelect = document.getElementById('categorySelect');
    const sourcesSelect = document.getElementById('sourcesSelect');
    const pageSizeSelect = document.getElementById('pageSizeSelect');
    const searchButton = document.getElementById('searchButton');
    const newsList = document.getElementById('newsList');

    searchButton.addEventListener('click', () => {
        const query = searchInput.value.trim();
        const country = countrySelect.value;
        const category = categorySelect.value;
        const sources = sourcesSelect.value;
        const pageSize = parseInt(pageSizeSelect.value);
        
        // Send the query to the backend
        fetch(`/headlines/?query=${query}&country=${country}&category=${category}&sources=${sources}&pageSize=${pageSize}`)
            .then((response) => response.json())
            .then((data) => {
                // Clear previous news
                newsList.innerHTML = '';

                if (data.articles && data.articles.length > 0) {
                    // Display news headlines
                    data.articles.forEach((article) => {
                        const articleElement = document.createElement('div');
                    articleElement.className = 'article';

                    const titleElement = document.createElement('h4');
                    titleElement.textContent = article.title;

                    const descriptionElement = document.createElement('p');
                    descriptionElement.textContent = article.description;

                    const sourceIdElement = document.createElement('p');
                    sourceIdElement.textContent = article.source.id;

                    const urlElement = document.createElement('a');
                    urlElement.textContent = 'Read More';
                    urlElement.href = article.url;
                    urlElement.target = '_blank'; // Open link in a new tab

                    const publishedAtElement = document.createElement('p');
                    const publishedDate = new Date(article.publishedAt);
                    publishedAtElement.textContent = publishedDate.toLocaleString('en-GB', { timeZone: 'Europe/Athens' });

                    articleElement.appendChild(titleElement);
                    articleElement.appendChild(publishedAtElement);
                    articleElement.appendChild(sourceIdElement);
                    articleElement.appendChild(descriptionElement);
                    articleElement.appendChild(urlElement);

                    const cardItemElement = document.createElement('div');
                    cardItemElement.className = 'card-body';

                    cardItemElement.appendChild(articleElement);
                    newsList.appendChild(cardItemElement);
                    });
                } else {
                    newsList.innerHTML = 'No results found.';
                }
            })
            .catch((error) => {
                console.error('Error fetching news data:', error);
                newsList.innerHTML = 'An error occurred while fetching data.';
            });
    });
});