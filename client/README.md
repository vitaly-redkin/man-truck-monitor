# MAN Truck Monitor Client

MAN Truck Monitor Client

## Quick Start

```shell
# install deps
yarn install

# run in development mode
yarn start

# build
yarn build
```

---

## General Information
The application has been created with the [Create React App](https://github.com/facebook/create-react-app).
The application uses Typescript as a language and google-map-react component as a React Google Maps wrapper. 
It also uses reactstrap (a Bootstrap wrapper) and react-select component for the dropdowns.

## Try It
Open you're browser to [http://localhost:3000](http://localhost:3000)

## Notes About Code
I tried not to overengneer the code. In the real life, when the funcionality would be much more complex, I would probably break the "main" component (Map) into several ones (the Google Map wrapper itself, the filter palel, the info panel, POIs and vehicle route) and use Redux to pass properties (and to update the shared state). But for the scope of the code challenge the code structure is "good enough".
Some pieces of the code may seem redundant (custom hooks, services) but I just borrowed them from my own toolkit with minor modifications.

## Testing
It would be quite hard to change the code to add UI unit tests and make them meaningful - in fact we would test the Google Maps API responses (which are subject to change without notice).

## Configuration
```.env``` file (not added to Git) and ```.env.example``` file (the template to create a real one). Before running the applicationjust copy the ```env.example``` to ```.env`` and set the Google Maps API key to your one (but please ensure Places API, Maps Javascript API and Directions API are enabled).

## Design Considerations
I tried to follow the design directions provided in the task descriptions but I made one concession: instead of connecting the vehicle last position with the selected POI with the arrow I show the Google Maps route and also show the POI name and route distance and duration in a separate panel.
There are two reasons for this:
* Truck driver is not a bird:-) He can't fly directly from his truck to the POI, so the driving distance and duration are more important than the direct distance.
* I probably have choosen a wrong Google Maps React wrapper - being fulled with the GitHub stars. It does the good job allowing me to create my own components over the map - but does not allow me to play with their z-order to show the arrow on top of POIs.

I also would prefer to not show the filter and info panels over the map (they sometimes hide the important map details) but it was in the requirements.