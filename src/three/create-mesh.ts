import Park from './mesh/park';
import Factory from './mesh/factory';
import city from './mesh/city';

let park: Park;
export function createPark() {
  park = new Park();
}
export function updateMesh(time: number) {
  park.update(time);
}

export function createFactory() {
  const factory = new Factory();
  factory.createPoints(factory.fighterGroup);
}

export function createCity() {
  city();
}
