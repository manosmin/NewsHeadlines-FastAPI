from fastapi import FastAPI, HTTPException, Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
import requests
from pymongo import MongoClient
from config import API_KEY, MONGO_URL
import uvicorn

app = FastAPI()

# Initialize MongoDB client
mongo_client = MongoClient(MONGO_URL)
db = mongo_client.news

@app.get('/headlines/')
def get_trending(query: str, country: str, category: str, sources: str, pageSize: int):
    try:
        # Construct the payload for the API query
        payload = {
            'q': query,
            'category': category,
            'country': country,
            'apiKey': API_KEY,
            'sources': sources,
            'pageSize': pageSize,
        }

        # Include the 'query' parameter if provided
        if query:
            payload['q'] = query

        # Include the 'category' parameter if provided
        if category:
            payload['category'] = category

        # Include the 'country' parameter if provided
        if country:
            payload['country'] = country

        # Include the 'pageSize' parameter if provided
        if pageSize:
            payload['pageSize'] = pageSize

        # Include the 'sources' parameter if provided
        if sources:
            payload['sources'] = sources

        
        # API Query for the most recent news headlines for user's specified query
        news_api_url = f'https://newsapi.org/v2/top-headlines'
        response = requests.get(news_api_url, params=payload)
        response.raise_for_status()  # Raise an exception if there's an HTTP error
        data = response.json()

        # Insert the data into MongoDB
        insert_into_mongodb(data)

        return data
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail="Failed to fetch data from News API")

def insert_into_mongodb(data):
    try:
        # Access the 'news' collection in MongoDB
        news_collection = db.news

        # Iterate through the articles and try to update with upsert
        for article in data.get('articles', []):
            # Define a unique filter based on the 'url' field
            unique_filter = {'url': article['url']}
            
            # Use the update_one method with upsert=True to insert or update
            news_collection.update_one(
                filter=unique_filter,
                update={'$set': article},
                upsert=True
            )
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to insert data into MongoDB")


# Serve static files (HTML, JavaScript, etc.)
app.mount("/static", StaticFiles(directory="static"), name="static")

# Initialize templates for HTML rendering
templates = Jinja2Templates(directory="templates")

@app.get("/")
async def read_root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

if __name__ == '__main__':
    uvicorn.run(app, host='0.0.0.0', port=5000)
