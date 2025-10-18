import os
import httpx
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("PERPLEXITY_API_KEY")
print(f"API Key loaded: {api_key[:20]}..." if api_key else "No API key found!")

if not api_key:
    raise ValueError("PERPLEXITY_API_KEY is not set in environment")


async def test_perplexity():
    url = "https://api.perplexity.ai/chat/completions"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }
    json_payload = {
        "model": "sonar",
        "messages": [{"role": "user", "content": "Say hello"}],
        "max_tokens": 10,
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(url, headers=headers, json=json_payload)

    if response.status_code == 200:
        data = response.json()
        print("✅ Perplexity API is working!")
        content = data.get("choices", [{}])[0].get("message", {}).get("content", "")
        print(f"Response: {content}")
    else:
        print(f"❌ Error {response.status_code}: {response.text}")

import asyncio
asyncio.run(test_perplexity())
