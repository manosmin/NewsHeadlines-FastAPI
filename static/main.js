document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('searchForm');
    const searchInput = document.getElementById('searchInput');
    const newsList = document.getElementById('newsList');

    searchForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const query = searchInput.value.trim();
        if (query) {
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

                        const titleElement = document.createElement('h2');
                        titleElement.textContent = article.title;

                        const descriptionElement = document.createElement('p');
                        descriptionElement.textContent = article.description;
                        
                        urlElement = document.createElement('a');
                        urlElement.textContent = 'Read More';
                        urlElement.href = article.url;
                        urlElement.target = '_blank'; // Open link in a new tab

                        const publishedAtElement = document.createElement('p');
                        const publishedDate = new Date(article.publishedAt);
                        publishedAtElement.textContent = 'Published At: ' + publishedDate.toLocaleString('el-GR');

                        articleElement.appendChild(titleElement);
                        articleElement.appendChild(descriptionElement);
                        articleElement.appendChild(publishedAtElement);
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
        } else {
            newsList.innerHTML = 'Please enter a query.';
        }
    });
});
