import mitt, { Emitter } from 'mitt';

type Events = {
  eventToggle: number;
  spriteClick: number;

  actionClick: number;
  toggleCamera: string;
  toggleControls: string;

  showFloor1: void;
  showFloor2: void;
  showWall: void;
  showAll: void;
  hideAll: void;
  flatFighter: void;
  recoverFighter: void;
  pointsFighter: void;
  pointsBlast: void;
  pointsBack: void;
};

const eventHub: Emitter<Events> = mitt<Events>();

export default eventHub;
