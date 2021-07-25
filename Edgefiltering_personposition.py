
#........................Canny edge detection ...........................#

#import cv2
#import numpy as np

#img = cv2.imread(r"C:\Users\Rakesh\Desktop\image.png", 0)
#cv2.imwrite("canny.jpg", cv2.Canny(img, 200, 300))
#cv2.imshow("canny", cv2.imread("canny.jpg"))
#cv2.waitKey()
#cv2.destroyAllWindows()

#...........................Canny edge detection (Loading multiple images and writing - Position of bounding box).........................#


import cv2
import numpy as np
import glob
import json

def edge_filter(image, sigma=0.33):
    #Compute the median of the single channel pixel intensities
    v = np.median(image)

    # Apply automatic Canny edge detection using the computed median
    lower = int(max(0, (1.0 - sigma) * v))
    upper = int(min(255, (1.0 + sigma) * v))
    return cv2.Canny(image, lower, upper)

# Read in each image and convert to grayscale
images = [cv2.imread(file,0) for file in glob.glob(r"C:\Users\Rakesh\Desktop\image\*.png")]

# Iterate through each image, perform edge detection, and save image
number = 0
jsonFile = open("info.json", "w")
for image in images:
    canny = edge_filter(image)
    cnts = cv2.findContours(canny, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)[-2:]
    cnts = cnts[0] if len(cnts) == 2 else cnts[1]
    for c in cnts:
        x,y,w,h = cv2.boundingRect(c)
        
        #cv2.rectangle(canny, (x, y), (x + w, y + h), (255,0,0), 1)

        print(x,y)
    cv2.imwrite('may_{}.png'.format(number), canny)
    aDict = {"Topleft": x, "Topleft":y}  # person position in the image rendered coordinates
    jsonString = json.dumps(aDict)
    jsonFile = open("info.json", "a")  # If needed we can add indent later. Depends on how we use the json file.
    jsonFile.write(jsonString)
    
    number += 1

