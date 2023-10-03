from fastapi import FastAPI, HTTPException
import requests
from pymongo import MongoClient
import json
import uvicorn

app = FastAPI()

# Initialize MongoDB client
mongo_client = MongoClient('mongodb://localhost:27017/')
db = mongo_client.news

@app.get('/headlines')
def get_trending():

    # API Query for the most recent news headlines
    news_api_key = '193223099a8045a2b2e24e49d4788aa4'
    news_api_url = f'https://newsapi.org/v2/top-headlines?country=us&apiKey={news_api_key}'
    response = requests.get(news_api_url)
    data = response.json()

    # Insert the data into MongoDB
    insert_into_mongodb(data)

    return data

@app.get('/headlines/{user_q}')
def get_trending_with_query(user_q: str):
    
    # API Query for the most recent news headlines for user's specified query
    news_api_key = '193223099a8045a2b2e24e49d4788aa4'
    news_api_url = f'https://newsapi.org/v2/top-headlines?q={user_q}&apiKey={news_api_key}'
    response = requests.get(news_api_url)
    data = response.json()

    # Insert the data into MongoDB
    insert_into_mongodb(data)

    return data

def insert_into_mongodb(data):
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

if __name__ == '__main__':
    uvicorn.run(app, host='0.0.0.0', port=5000)
