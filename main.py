
import googleapiclient.discovery
import googleapiclient.errors
from fastapi import FastAPI, Query
from Model import model_eval
from typing import List, Annotated, Union
from fastapi.middleware.cors import CORSMiddleware
from langdetect import detect

app = FastAPI()
allowed_origins = [
    'https://www.youtube.com',
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,  # Replace this with the appropriate origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


yt_api_key = 'AIzaSyBwCHdoDReP7RRJSx6V_Ztu1O_crZrYoa8'
api_service_name = "youtube"
api_version = "v3"

youtube = googleapiclient.discovery.build(
    api_service_name, api_version, developerKey=yt_api_key)

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["https://www.youtube.com"],  # Replace this with the appropriate origin
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )


yt_api_key = 'AIzaSyBwCHdoDReP7RRJSx6V_Ztu1O_crZrYoa8'
api_service_name = "youtube"
api_version = "v3"

youtube = googleapiclient.discovery.build(
    api_service_name, api_version, developerKey=yt_api_key)


@app.get("/")
async def root(video_ID: str, threshold: Annotated[Union[List[str], None], Query()] = None, comment_count: int = 50):
    threshold = [float(i) for i in threshold]

    request = youtube.commentThreads().list(
        part = "snippet",
        videoId = video_ID,
        maxResults = comment_count
    )

    response = request.execute()
    filtered = []

    for item in response['items']:
        comment = item['snippet']['topLevelComment']['snippet']['textDisplay']

        try:
            lang = detect(comment)
        except:
            continue

        if lang != 'en': continue

        try:
            evaluation = model_eval(comment)
        except:
            continue

        valid = True
        for i in range(len(evaluation)):
            if threshold[i] < evaluation[i]:
                valid = False
                break
        if valid: 
            filtered.append(comment)

    return filtered
    