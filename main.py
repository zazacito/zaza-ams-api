from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://zazacito.github.io/zaza-ams-api/"],
    allow_methods=["POST"],
    allow_headers=["*"],
)

class RequestBody(BaseModel):
    session_id: str
    athlete_id: str
    api_key: str

@app.get("/")
async def root():
    return {"message": "Welcome to the Zazacito API!"}

@app.post("/api/session")
async def get_session_raw_data(request_body: RequestBody):
    catapult_api_url = f"https://connect-eu.catapultsports.com/api/v6/activities/{request_body.session_id}/athletes/{request_body.athlete_id}/sensor"
    headers = {"Authorization": "Bearer " + request_body.api_key}
    try:
        response = requests.get(catapult_api_url, headers=headers)
        response.raise_for_status()
        
        data = response.json()
        if data:
            return data[0].get("data")
        else:
            return "No session data found for the session ID and athlete ID."
    except requests.exceptions.RequestException as e:
        return "An error occurred while fetching the session raw data."

if __name__ == "__main__":
    import os
    from fastapi.staticfiles import StaticFiles

    # Serve the static files
    app.mount("/static", StaticFiles(directory="static"), name="static")

    # Run the application using uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.environ.get("PORT", 8000)))
