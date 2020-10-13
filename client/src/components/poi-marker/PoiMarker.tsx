import * as React from 'react';
import GoogleMapReact from 'google-map-react';

import { PoiModel, PoiTypeEnum } from '../../models/PoiModel';
import { useSafeCallback as useCallback } from '../utils/custom-hooks/CustomHooks';

import './PoiMarker.css';
import GasStationImage from '../../images/icn-gas-station.png';
import HotelImage from '../../images/icn-hotel.png';
import RestaurantImage from '../../images/icn-restaurant.png';
import CurrentLocationImage from '../../images/icn-current-location.png';
import FirstLocationImage from '../../images/icn-first-location.png';
import PathImage from '../../images/icn-path.png';


function PoiMarker(
  props: PoiModel & 
  GoogleMapReact.Coords & 
  {
    noShift?: boolean;
    onClick?: (poi: PoiModel) => void;
  }
): JSX.Element {
  const imgUrl = (
    props.type === PoiTypeEnum.GasStation      ? GasStationImage :
    props.type === PoiTypeEnum.Hotel           ? HotelImage :
    props.type === PoiTypeEnum.Restaurant      ? RestaurantImage :
    props.type === PoiTypeEnum.CurrentPosition ? CurrentLocationImage :
    props.type === PoiTypeEnum.FirstPosition   ? FirstLocationImage :
                                                  PathImage
  );

  const onClick = useCallback(
    (): void => {
      if (props.onClick) {
        props.onClick(props);
      }
    },
    [props]
  );

  const className: string = (
    props.type === PoiTypeEnum.Path || props.type === PoiTypeEnum.FirstPosition ?
    'path-marker' :
    'poi-marker'
  );

  const render = (): JSX.Element => {
    return (
      <img src={imgUrl} 
           title={props.name}
           alt={props.name} 
           className={`${className} ${props.noShift ? ' ' : 'shift'}`}
           onClick={onClick}
      />
    );
  };

  return render();
}

export default PoiMarker;