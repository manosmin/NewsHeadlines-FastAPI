
# FastAPI News Headlines Aggregator 

This project combines the power of Python and FastAPI to provide users with up-to-the-minute news articles from a wide range of sources. The users can access the latest headlines, but they can also enter custom queries to find articles on specific topics of interest. A NoSQL database is used to efficiently store and manage the vast amount of articles data.


## Features

- Latest news articles are fetched from [News API](https://newsapi.org/) based on user's preference.
- Articles are stored in MongoDB for efficient access and management.
- Users can access headlines or perform custom searches.
## Tech Stack

**Front End:** Javascript, HTML, Bootstrap 4, jQuery <br>

**Back End:** Python, FastAPI, MongoDB <br>

**Tools:** Docker


## Deployment
Create a `config.py` file and initialize variables `API_KEY` (i.e. `7n6x01257610n479c1f45`) and `MONGO_URL` (i.e. `mongodb://localhost:27017/`)

Then deploy this project with Docker by running

```bash
  docker run -d -p 27017:27017 --name mongodb mongo 
  docker build -t fast-news-api . 
  docker run -d -p 5000:5000 fast-news-api 
```

## Screenshots

![Home](https://github.com/manosmin/Headlines-FastAPI/blob/master/screenshots/home.gif)