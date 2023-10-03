from fastapi import FastAPI, HTTPException
import requests
from pymongo import MongoClient

app = FastAPI()

# Initialize MongoDB client
mongo_client = MongoClient('mongodb://localhost:27017/')
db = mongo_client.news

@app.get('/headlines')
def get_trending():
    try:
        # API Query for the most recent news headlines
        news_api_key = '193223099a8045a2b2e24e49d4788aa4'
        news_api_url = f'https://newsapi.org/v2/top-headlines?country=us&apiKey={news_api_key}'
        response = requests.get(news_api_url)
        response.raise_for_status()  # Raise an exception if there's an HTTP error
        data = response.json()

        # Insert the data into MongoDB
        insert_into_mongodb(data)

        return data
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail="Failed to fetch data from News API")

@app.get('/headlines/{user_q}')
def get_trending_with_query(user_q: str):
    try:
        # API Query for the most recent news headlines for user's specified query
        news_api_key = '193223099a8045a2b2e24e49d4788aa4'
        news_api_url = f'https://newsapi.org/v2/top-headlines?q={user_q}&apiKey={news_api_key}'
        response = requests.get(news_api_url)
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

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host='0.0.0.0', port=5000)
