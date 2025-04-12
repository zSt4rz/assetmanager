import cv2
import numpy as np

# Load YOLO config, weights, and class names
net = cv2.dnn.readNet("scripts/yolov3.cfg", "scripts/yolov3.weights")
with open("scripts/coco.names", "r") as f:
    classes = f.read().strip().split("\n")

# Load image
image = cv2.imread("scripts/coffeeontable.jpg")
height, width = image.shape[:2]

# Convert image to blob for YOLO
blob = cv2.dnn.blobFromImage(image, 1/255.0, (416, 416), swapRB=True, crop=False)
net.setInput(blob)

# Get layer names for output
layer_names = net.getLayerNames()
output_layers = [layer_names[i - 1] for i in net.getUnconnectedOutLayers().flatten()]

# Forward pass
outputs = net.forward(output_layers)

# Parse outputs
boxes, confidences, class_ids = [], [], []
confidence_threshold = 0.5
nms_threshold = 0.4

for output in outputs:
    for detection in output:
        scores = detection[5:]
        class_id = np.argmax(scores)
        confidence = scores[class_id]
        if confidence > confidence_threshold:
            center_x = int(detection[0] * width)
            center_y = int(detection[1] * height)
            w = int(detection[2] * width)
            h = int(detection[3] * height)
            x = int(center_x - w / 2)
            y = int(center_y - h / 2)
            boxes.append([x, y, w, h])
            confidences.append(float(confidence))
            class_ids.append(class_id)

# Apply Non-Maximum Suppression to reduce overlapping boxes
indexes = cv2.dnn.NMSBoxes(boxes, confidences, confidence_threshold, nms_threshold)

# Draw boxes
for i in indexes.flatten():
    x, y, w, h = boxes[i]
    label = str(classes[class_ids[i]])
    confidence = confidences[i]
    color = (0, 255, 0)  # Green
    cv2.rectangle(image, (x, y), (x + w, y + h), color, 2)
    cv2.putText(image, f"{label} {confidence:.2f}", (x, y - 10),
                cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)

# Show or save the result
cv2.imshow("YOLO Object Detection", image)
cv2.waitKey(0)
cv2.destroyAllWindows()
