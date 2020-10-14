import * as React from 'react';
import GoogleMapReact from 'google-map-react';
import { Row, Col, Button, Alert } from 'reactstrap';
import Select from 'react-select';

import { 
  useSafeState as useState,
  useSafeCallback as useCallback 
} from '../utils/custom-hooks/CustomHooks';
import { ServiceError } from '../../service/BaseService';
import { VehicleService } from '../../service/VehicleService';
import { ValueLabelModel } from '../../models/ValueLabelModel';
import { VehicleModel } from '../../models/VehicleModel';
import { VehiclePositionModel } from '../../models/VehiclePositionModel';
import { PoiModel, PoiTypeEnum } from '../../models/PoiModel';
import PoiMarker from '../poi-marker/PoiMarker';

import './Map.css';

// Google Maps API key
const googleMapsApiKeys = {
  key: process.env.REACT_APP_GOOGLE_MAPS_KEY as string,
  libraries: ['places'],
};

// POI types
const poiTypes: ValueLabelModel[] = [
  {value: PoiTypeEnum.All, label: 'View All'},
  {value: PoiTypeEnum.GasStation, label: 'Gas stations'},
  {value: PoiTypeEnum.Restaurant, label: 'Restaurants'},
  {value: PoiTypeEnum.Hotel, label: 'Hotels'},
];

// Radiuses to search for POI in
const radiuses: ValueLabelModel[] = [
  {value: -1, label: 'Select Radius'},
  ...[0.5, 1, 2, 3, 5, 10, 20, 50, 100].map(
    r => ({value: r, label: `${r} km`})
  )
];

// The number of the last vehicle route positions to fetch
const routeStepCount: number = 10;

/**
 * Interface for the ApiLoaded callback of the Google Maps component
 */
interface IApiLoadedParams {
  map: google.maps.Map;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  maps: any;
}

// Default map center. In the real life should be configurable (in DB?)
const defaultCenter: GoogleMapReact.Coords = {lat: 38.7197108, lng: -9.1569673,};

/**
 * The main component (to contain everything else).
 */
function Main(): JSX.Element {
  const [error, setError] = useState<string>('');
  const [center, setCenter] = useState<GoogleMapReact.Coords>(defaultCenter);

  // Was not able to find type for google.maps ;-(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [maps, setMaps] = useState<any | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);  

  const [licensePlates, setLicensePlates] = useState<ValueLabelModel[]>([]);
  const [licensePlate, setLicensePlate] = useState<ValueLabelModel | null>(null);
  const [poiType, setPoiType] = useState<ValueLabelModel>(poiTypes.find(i => i.value === PoiTypeEnum.All)!);
  const [radius, setRadius] = useState<ValueLabelModel | null>(null);
  const [vehiclePath, setVehiclePath] = useState<GoogleMapReact.Coords[]>([]);
  const [pois, setPois] = useState<PoiModel[]>([]);
  const [selectedPoi, setSelectedPoi] = useState<PoiModel | null>(null);
  const [selectedPoiRoute, setSelectedPoiRoute] = useState<{distance: string; duration: string} | null>(null);

  const routeRef = React.useRef<google.maps.DirectionsRenderer | null>(null);

  /**
   * API error handler.
   * 
   * @param e API error
   */
  const onError = useCallback(
    (e: ServiceError): void => {
      console.log(e);
      setError(e.message);
    },
    []
  );

  /**
   * Handler for the vehicle list fetch success.flex-end
   * 
   * @param result API call result
   */
  const onFetchVehicleSuccess = useCallback(
    (result: VehicleModel[]): void => {
      setLicensePlates(
        result.map(r => ({value: r.id, label: r.licensePlate}))
      );
    },
    []
  );

  /**
   * Called when component is mounted to fetch license plates.
   */
  React.useEffect(
    (): void => {
      new VehicleService().fetchVehicles(
        onFetchVehicleSuccess,
        onError,
      );
    },
    [onError, onFetchVehicleSuccess]
  );


  /**
   * Handler for the vehicle list fetch success.flex-end
   * 
   * @param result API call result
   */
  const onFetchVehicleRouteSuccess = useCallback(
    (result: VehiclePositionModel[]): void => {
      const vehiclePath: GoogleMapReact.Coords[] = 
        result.map(r => ({lat: r.lat, lng: r.lng}));
      setVehiclePath(vehiclePath);
      if (vehiclePath.length) {
        setCenter(vehiclePath[0]);
      }
    },
    []
  );

  /**
   * Adds Google Maps route from the vehicle last position to the given POI.
   * 
   * @param poi POI to add the route to
   */
  const addRoute = useCallback(
    (poi: PoiModel): void => {
      if (!vehiclePath.length) {
        return;
      }

      const directionsService = new google.maps.DirectionsService();
      const directionsRenderer = new google.maps.DirectionsRenderer({preserveViewport: true});
      directionsRenderer.setMap(map);
      const route: google.maps.DirectionsRequest = {
        origin: {lat: vehiclePath[0].lat, lng: vehiclePath[0].lng},
        destination: {lat: poi.lat, lng: poi.lng},
        travelMode: google.maps.TravelMode.DRIVING,
    }
  
    directionsService.route(
      route,
      (result: google.maps.DirectionsResult, status: google.maps.DirectionsStatus): void => {
        if (status !== google.maps.DirectionsStatus.OK) {
          setError('Directions request failed due to ' + status);
          return;
        } else {
          directionsRenderer.setDirections(result);
          // Tutorial says to use the first leg...
          const directionsData = result.routes[0].legs[0]; 
          if (!directionsData) {
            setError('Directions request failed');
            return;
          } else {
            setSelectedPoiRoute({distance: directionsData.distance.text, duration: directionsData.duration.text})
          }
        }
      });

      // Save direction renderer to later remove it from the map
      routeRef.current = directionsRenderer;
    },
    [map, vehiclePath]
  );

  /**
   * Clears the added route from the Google Map.
   */
  const clearRoute = useCallback(
    (): void => {
      if (routeRef.current) {
        routeRef.current.setMap(null);
      }
    },
    []
  );

  /**
   * License plate change handler.
   * 
   * @param selectedOption selected license plate option
   */
  const changeLicensePlate = useCallback(
    (selectedOption: ValueLabelModel): void => {
      setLicensePlate(selectedOption);
      setSelectedPoi(null);
      setSelectedPoiRoute(null);
      clearRoute();

      new VehicleService().fetchVehicleRoute(
        selectedOption.value,
        routeStepCount,
        onFetchVehicleRouteSuccess,
        onError,
      );
    },
    [clearRoute, onError, onFetchVehicleRouteSuccess]
  );

  /**
   * POI Type change event handler.
   * 
   * @param selectedOption selected POI type option
   */
  const changePoiType = useCallback(
    (selectedOption: ValueLabelModel): void => {
      setPoiType(selectedOption);
    },
    []
  );

  /**
   * Radius change event handler.
   * 
   * @param selectedOption selected POI type option
   */
  const changeRadius = useCallback(
    (selectedOption: ValueLabelModel): void => {
      setRadius(selectedOption);
    },
    []
  );

  /**
   * Performs the POI seach.
   */
  const doSearch = useCallback(
    (): void => {
      const pt: PoiTypeEnum = poiType.value;
      const types: string[] = [
        (pt === PoiTypeEnum.All || pt === PoiTypeEnum.GasStation ? 'gas_station' : ''),
        (pt === PoiTypeEnum.All || pt === PoiTypeEnum.Hotel ? 'lodging' : ''),
        ...(pt === PoiTypeEnum.All || pt === PoiTypeEnum.Restaurant ? ['cafe', 'restaurant'] : ['']),
      ].filter(p => p);
      
      clearRoute();
      setSelectedPoi(null);
      setSelectedPoiRoute(null);
      setPois([]);

      // nearbySearch() can only work with one type in one call - 
      // so perform N requests and merge the results (elimimating dublicates)
      types.forEach((type: string) => {
        const request: google.maps.places.PlaceSearchRequest = {
          type,
          openNow: true,
          location: vehiclePath[0],
          radius: (radius ? radius.value : 1000) * 1000,
        };
      
        const service: google.maps.places.PlacesService = new maps.places.PlacesService(map);
        service.nearbySearch(
          request, 
          (results: google.maps.places.PlaceResult[], status: google.maps.places.PlacesServiceStatus) => {
            if (status === maps.places.PlacesServiceStatus.OK) {
              const newPois: PoiModel[] = results
                // Eliminate results without coordinates or with unknown types
                .filter(r => !!r.geometry && !!r.types)
                .map((r, index) => {
                  //console.log(r);

                  const type: PoiTypeEnum = (
                    r.types!.includes('gas_station') ? PoiTypeEnum.GasStation :
                    r.types!.includes('lodging')     ? PoiTypeEnum.Hotel :
                                                       PoiTypeEnum.Restaurant
                  );
                  return new PoiModel(
                    r.place_id ?? `r.name__${index}`, 
                    r.name, 
                    type, 
                    r.geometry!.location.lat(), 
                    r.geometry!.location.lng()
                  );
                });
              // Merge POIs eliminating duplicates (one place can be both a hotel and a restaurant)
              setPois(ps => [...ps, ...newPois.filter(np => !ps.find(p => p.id === np.id))]);
            }
          }
        );
      });
    },
    [vehiclePath, map, maps, poiType.value, radius, clearRoute]
  );

  /**
   * A callback for the Google Maps component API loaded event.
   */
  const handleApiLoaded = useCallback(
    (apiProps: IApiLoadedParams) => {
      setMap(apiProps.map);
      setMaps(apiProps.maps);
    },
    []
  );

  /**
   * Toggles POI selected status.
   * 
   * @param poi POI to toggle selection of
   */
  const togglePoi = useCallback(
    (poi: PoiModel): void => {
      clearRoute();
      const select: boolean = (!selectedPoi || selectedPoi.id !== poi.id);
      
      setSelectedPoi(select ? poi : null);
      setSelectedPoiRoute(null);
      if (select) {
        addRoute(poi);
      }
    },
    [addRoute, clearRoute, selectedPoi]
  );

  const fp: PoiModel | null = (
    vehiclePath.length > 0 ?
    new PoiModel(
      'First position',
      'First position',
      PoiTypeEnum.FirstPosition,
      vehiclePath[vehiclePath.length - 1].lat,
      vehiclePath[vehiclePath.length - 1].lng
    ) :
    null
  );
  const cp: PoiModel | null = (
    vehiclePath[0] ?
    new PoiModel(
      'Current position',
      'Current position',
      PoiTypeEnum.CurrentPosition,
      vehiclePath[0].lat,
      vehiclePath[0].lng
    ) :
    null
  );

  const searchAvailable: boolean = (!!maps && !!map && !!radius && !!vehiclePath.length);

  /**
   * Renders filters.
   */
  const renderFilters = (): JSX.Element => {
    return (
      <div className="filters">
        <Row>
          <Col className='col-4 pr-0'>
            <Select options={licensePlates}
                    value={licensePlate}
                    onChange={changeLicensePlate}
                    placeholder='Select license plate...'
            /> 
          </Col>
          <Col className='col-3 pr-0'>
            <Select options={poiTypes}
                    value={poiType}
                    onChange={changePoiType}
                    placeholder='Select POI Type...'
            /> 
          </Col>
          <Col className='col-3 pr-0'>
            <Select options={radiuses}
                    value={radius}
                    onChange={changeRadius}
                    placeholder='Select radius...'
            /> 
          </Col>
          <Col className='col-2'>
            <Button color='primary'
                    onClick={doSearch}
                    className='w-100'
                    disabled={!searchAvailable}
                    title={!searchAvailable ? 'Select license plate and radius' : ''}
            >
              Apply
            </Button>
          </Col>
        </Row>
      </div>
    );
  }

  /**
   * Renders a panel with selected POI properties (name and driving distance/duration).
   */
  const renderSelectedPoiProps = (): JSX.Element | null => {
    if (!selectedPoi) {
      return null;
    }

    return (
      <div className="poi-props">
        <Row>
          <Col className='col-8'>
            <PoiMarker {...selectedPoi} noShift={true}/> <strong>{selectedPoi.name}</strong>
          </Col>
          {selectedPoiRoute &&
            <Col className='col-4 text-right'>
              {`${selectedPoiRoute.distance}, ${selectedPoiRoute.duration}`}
            </Col>
          }
        </Row>
      </div>
    )
  };


  /**
   * Renders a panel with error.
   */
  const renderError = (): JSX.Element | null => {
    if (!error) {
      return null;
    }

    return (
      <div className='error'>
        <Alert color="danger">{error}</Alert>
      </div>
    )
  };

  /**
   * Renders POI markers (selected one is always rendered the last to be on top).
   * push() is used instead of array manipulations because of TS compiler foolishness.
   * Also if I wrap markes in <></> they are not rendered correctly on the map.
   */
  const renderPois = (): JSX.Element[] => {
    const poisToRender = pois.filter(poi => !selectedPoi || poi.id !== selectedPoi.id);
    if (selectedPoi) {
      poisToRender.push(selectedPoi);
    }

    return (
        poisToRender.map(poi => <PoiMarker key={poi.id} {...poi} onClick={togglePoi} />)
    );
  };
  
  /**
   * Renders vehicle path/
   * push() and foreach() is used instead of array manipulations because of TS compiler foolishness.
   * Also if I wrap markes in <></> they are not rendered correctly on the map.
   */
  const renderPath = (): JSX.Element[] => {
    const path: JSX.Element[] = [];
    if (fp) {
      path.push(<PoiMarker key='first' {...fp} />);
      const intermediatePoints: PoiModel[] = 
        vehiclePath
          .slice(1, vehiclePath.length - 1)
          .map((p, index) => new PoiModel(`path_${index}`, '', PoiTypeEnum.Path, p.lat, p.lng));
      intermediatePoints.forEach(
        poi => path.push(<PoiMarker key={poi.id} {...poi} />)
      );
    }
    if (cp) {
      path.push(<PoiMarker key='current' {...cp} />);
    }

    return path;
  };

  /**
   * Component render function.
   */
  const render = (): JSX.Element => {
    return (
      <div className='main'>
        {renderFilters()}
        {renderSelectedPoiProps()}
        {renderError()}

        <GoogleMapReact
          bootstrapURLKeys={googleMapsApiKeys}
          defaultCenter={center}
          center={center}
          defaultZoom={15}
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={handleApiLoaded}
        >
          {renderPois()}
          {renderPath()}
        </GoogleMapReact>
      </div>
    );
  }

  return render();
}

export default Main;
