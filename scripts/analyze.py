import sys
import cv2

def analyze_image(path):
    img = cv2.imread(path)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    edges = cv2.Canny(gray, 50, 150)
    return f"Image Shape: {img.shape}, Edge Detection Complete"

if __name__ == "__main__":
    path = sys.argv[1]
    print(analyze_image(path))
