import json 
import random
from random import randint
#from faker import Faker
#fake = Faker('en_US')

for i in range(1,10):
  
    my_dict = {
    "drone": {
        "speed": random.randrange(1,10),
        "height": 35.0,
        "eastWest": 0.0,
        "northSouth": 0.0,
        "camera": {
            "view": 45,
            "images": 30,
            "sampling": 1,
            "resolution": 512,
            "type": "monochrome"
        },
        "cpu": {
            "speed": 0.50
        }
    },
    "forest": {
        "size": 250,
        "persons": 15,
        "ground": 70,
        "trees": {
            "levels": 4,
            "twigScale": 0.40,
            "homogeneity": 70,
            "type": "broad-leaf",
            "branching": {
                "initialBranchLength": 0.50,
                "lengthFalloffFactor": 0.85,
                "lengthFalloffPower": 0.85,
                "clumpMax": 0.45,
                "clumpMin": 0.40,
                "branchFactor": 2.45,
                "dropAmount": -0.10,
                "growAmount": 0.25,
                "sweepAmount": 0.00
            },
            "trunk": {
                "maxRadius": 0.10,
                "climbRate": 0.60,
                "trunkKink": 0.10,
                "treeSteps": 8.00,
                "taperRate": 0.95,
                "radiusFalloffRate": 0.70,
                "twistRate": 3.00,
                "trunkLength": 2.50
            }
        }
    },
    "material": {
        "color": {
            "tree": "0x613615",
            "twig": "0x0c500e",
            "ground": "0x010101",
            "plane": "0x010101",
            "person": "0xffffff",
            "background": "0x87ceeb"
        }
    }

}
    print (my_dict)
    # Code below has to be changed
    
    with open('may' + str(i), 'w') as json_file:
        json.dump(my_dict, json_file,indent=4)
   



