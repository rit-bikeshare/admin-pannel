import { all } from '../common-redux/all';
import BikeRack from './records/BikeRack';

export const name = 'bikeracks';
export const path = 'bike-racks/';
export const record = BikeRack;
export const indexFn = bikerack => bikerack.get('id');

export const { actions, reducer } = all({ name, path, record, indexFn });
