import os
from google import genai
from google.genai import types
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def analyze_image(image_path: str):
    """Analyzes an image and returns a list of items with counts"""
    client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))
    
    try:
        # Upload the image
        files = [client.files.upload(file=image_path)]
        
        # Model configuration
        model = "gemini-2.0-flash-thinking-exp-01-21"
        prompt = """List every distinct item in this image and their counts. If items are close enough together in the same category, just group them together, such as chess pieces and billiard balls; make sure after you group them together, you still provide the amount of items of that group there is
Format exactly like this:
- Item 1: X
- Item 2: Y
Include only the list, no explanations or additional text."""
        
        contents = [
            types.Content(
                role="user",
                parts=[
                    types.Part.from_uri(
                        file_uri=files[0].uri,
                        mime_type=files[0].mime_type
                    ),
                    types.Part(text=prompt)  # Changed from from_text()
                ]
            )
        ]
        
        # Get the analysis
        print(f"Analyzing {image_path}...\n")
        response = client.models.generate_content(
            model=model,
            contents=contents,
            config=types.GenerateContentConfig(response_mime_type="text/plain")
        )
        
        print("Items found:")
        print(response.text)
    
    except Exception as e:
        print(f"Error occurred: {str(e)}")
        if 'files' in locals():
            for file in files:
                try:
                    client.files.delete(file.id)
                except:
                    pass

if __name__ == "__main__":
    # Change this to your image path
    image_path = "scripts/livingroom.png"  
    analyze_image(image_path)