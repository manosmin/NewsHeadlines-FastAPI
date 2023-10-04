document.addEventListener('DOMContentLoaded', async () => {
    const searchForm = document.getElementById('searchForm');
    const searchInput = document.getElementById('searchInput');
    const newsList = document.getElementById('newsList');

    const fetchData = async (query) => {
        try {
            const response = await fetch(`/headlines/${query}`);
            const data = await response.json();

            if (data.articles && data.articles.length > 0) {
                // Clear previous news
                newsList.innerHTML = '';

                // Display news headlines
                data.articles.forEach((article) => {
                    const articleElement = document.createElement('div');
                    articleElement.className = 'article';

                    const titleElement = document.createElement('h4');
                    titleElement.textContent = article.title;

                    const descriptionElement = document.createElement('p');
                    descriptionElement.textContent = article.description;

                    const urlElement = document.createElement('a');
                    urlElement.textContent = 'Read More';
                    urlElement.href = article.url;
                    urlElement.target = '_blank'; // Open link in a new tab

                    const publishedAtElement = document.createElement('p');
                    const publishedDate = new Date(article.publishedAt);
                    publishedAtElement.textContent = article.source.id + ' ' + publishedDate.toLocaleString('en-GB', { timeZone: 'Europe/Athens' });

                    articleElement.appendChild(titleElement);
                    articleElement.appendChild(publishedAtElement);
                    articleElement.appendChild(descriptionElement);
                    articleElement.appendChild(urlElement);

                    newsList.appendChild(articleElement);
                });
            } else {
                newsList.innerHTML = 'No results found.';
            }
        } catch (error) {
            console.error('Error fetching news data:', error);
            newsList.innerHTML = 'An error occurred while fetching data.';
        }
    };

    // Fetch data on page startup
    fetchData('');

    searchForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const query = searchInput.value.trim();
        if (query) {
            fetchData(query);
        } else {
            newsList.innerHTML = 'Please enter a query.';
        }
    });
});
