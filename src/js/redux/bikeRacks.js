import { BikeRack } from '../models';
import { all } from './common/all';

export const name = 'bikeracks';
export const path = 'admin/bike-racks/';
export const record = BikeRack;
export const indexFn = bikerack => bikerack.get('id');

export const { actions, reducer } = all({ name, path, record, indexFn });