from flask import Flask, request, jsonify
import requests
import os

app = Flask(__name__)

WEATHER_API_KEY = os.environ.get(7e546741e4d24f2f88083023253101) # Get API key from environment variable

@app.route('/weather')
def get_weather():
    lat = request.args.get('lat')
    lon = request.args.get('lon')
    if not lat or not lon:
        return jsonify({"error": "Latitude and longitude are required."}), 400

    weather_url = f"http://api.weatherapi.com/v1/current.json?key={WEATHER_API_KEY}&q={lat},{lon}"

    try:
        response = requests.get(weather_url)
        response.raise_for_status() # Raise HTTPError for bad responses (4xx or 5xx)
        data = response.json()
        return jsonify({
            "temp": data['current']['temp_c'],
            "condition": data['current']['condition']['text']
        })
    except requests.exceptions.RequestException as e:
        return jsonify({"error": f"Weather API error: {e}"}), 500
    except KeyError:
        return jsonify({"error": "Invalid weather API response."}), 500

@app.route('/news')
def get_news():
    news_data = "Stock Market: Sensex up 200 points | Traffic Update: Heavy congestion on MG Road"
    return jsonify({"news": news_data})

def lambda_handler(event, context):
    return app(event, context)