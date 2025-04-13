import os
from google import genai
from google.genai import types
from dotenv import load_dotenv
import json

# Load environment variables
load_dotenv()

def parse_response_to_dict(response_text: str) -> dict:
    """Converts the model's text response into a dictionary"""
    items_dict = {}
    lines = response_text.strip().split('\n')
    
    for line in lines:
        if line.startswith('-'):
            # Remove the '- ' prefix and split on ': '
            parts = line[2:].split(': ')
            if len(parts) == 2:
                item, count = parts
                try:
                    items_dict[item.strip()] = int(count.strip())
                except ValueError:
                    # Handle cases where count isn't a number
                    items_dict[item.strip()] = count.strip()
    return items_dict

def analyze_image(image_path: str) -> dict:
    """Analyzes an image and returns a dictionary of items with counts"""
    client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))
    items_dict = {}
    
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
                    types.Part(text=prompt)
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
        
        print("Raw response:")
        print(response.text)
        
        # Convert response to dictionary
        items_dict = parse_response_to_dict(response.text)
        
        print("\nItems dictionary:")
        print(items_dict)
        
        return items_dict
    
    except Exception as e:
        print(f"Error occurred: {str(e)}")
        if 'files' in locals():
            for file in files:
                try:
                    client.files.delete(file.id)
                except:
                    pass
        return {}

if __name__ == "__main__":
    # Change this to your image path
    image_path = "scripts/livingroom.png"  
    result_dict = analyze_image(image_path)
    
    # Example of how to use the dictionary
    print("\nExample usage:")
    for item, count in result_dict.items():
        print(f"There are {count} {item}(s) in the image")
    
    with open("scripts/detected_counts.json", "w") as json_file:
        json.dump(result_dict, json_file, indent=4)