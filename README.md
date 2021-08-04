# AOS-Simulation
Airborne Optical Sectioning Simulation based on https://arxiv.org/abs/2009.08835.

## Abstract
> We show that automated person detection under occlusion conditions can be significantly improved by combining multi-perspective images before classification. Here, we employed image integration by Airborne Optical Sectioning (AOS) - a synthetic aperture imaging technique that uses camera drones to capture unstructured thermal light fields - to achieve this with a precision/recall of 96/93%. Finding lost or injured people in dense forests is not generally feasible with thermal recordings, but becomes practical with use of AOS integral images. Our findings lay the foundation for effective future search and rescue technologies that can be applied in combination with autonomous or manned aircraft. They can also be beneficial for other fields that currently suffer from inaccurate classification of partially occluded people, animals, or objects.

## Video
[![YouTube](https://img.youtube.com/vi/kyKVQYG-j7U/0.jpg)](https://www.youtube.com/watch?v=kyKVQYG-j7U)

## Demo
Use Visual Studio code to run the simulation
Or check out [Github pages](https://jku-icg.github.io/aos-simulation/)

## Status
Work in progress, more to come...

### Automatic Simulation
It is possible now to simulate a flight and download the corresponding images with a URL parameters. 
For example you can use https://jku-icg.github.io/aos-simulation/?download=1 to run a configuration.

# ToDos:

[ ] run non-realtime: right now everything runs in real-time. This is a problem for generating huge training datasets because multiple frames will be rendered although only a handful (e.g., 10 or 30) will be needed. 



## License
[MIT](/LICENSE)
