
import googleapiclient.discovery
import googleapiclient.errors
from fastapi import FastAPI, Query
from Model import eval
from typing import List, Annotated, Union

app = FastAPI()

yt_api_key = 'AIzaSyBwCHdoDReP7RRJSx6V_Ztu1O_crZrYoa8'
api_service_name = "youtube"
api_version = "v3"

youtube = googleapiclient.discovery.build(
    api_service_name, api_version, developerKey=yt_api_key)


@app.get("/")
async def root(video_ID: str, threshold: Annotated[Union[List[str], None], Query()] = None):
    threshold = [float(i) for i in threshold]

    request = youtube.commentThreads().list(
        part="snippet",
        videoId=video_ID,
        maxResults=50
    )

    response = request.execute()
    filtered = []

    for item in response['items']:
        comment = item['snippet']['topLevelComment']['snippet']['textDisplay']
        evaluation = eval(comment)
        # print(evaluation)
        valid = True
        for i in range(len(evaluation)):
            if threshold[i] < evaluation[i]:
                valid = False
                break
        if valid: 
            filtered.append(comment)

    return filtered
    