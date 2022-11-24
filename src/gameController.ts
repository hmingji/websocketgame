import random from 'random-name';
import { TICK_RATE } from './constants';
import { loadMap } from './mapController';
import { handleGameMotion } from './motionController';
import { emitPlayers } from './socketController';

export let players: TPlayer[] = [];
export let bullets: TBullet[] = [];

export const removePlayer = (id: number) => {
  players = players.filter((player) => player.id !== id);
};

export function createPlayer(id: number) {
  const player: TPlayer = {
    x: 70,
    y: 70,
    v: 0,
    score: 0,
    name: random.first(),
    id,
    color: `#${Math.floor(Math.random() * (0xffffff + 1)).toString(16)}`,
    facing: 'Right',
    bullet: 3,
    gunState: 'Ready',
    state: 'Normal',
  };
  players.push(player);
  return player;
}

export function fireBullet(x: number, y: number, fireDirection: Direction) {
  const bullet: TBullet = {
    x,
    y,
    travelTo: fireDirection,
  };
  bullets.push(bullet);
  return bullet;
}

export function getPlayers() {
  return players;
}

export function getBullets() {
  return bullets;
}

function getProcessMs() {
  const hrTime = process.hrtime();
  return (hrTime[0] * 1e9 + hrTime[1]) / 1e6;
}

function tick(delta: number) {
  handleGameMotion(players, bullets, delta);
  emitPlayers(players);
}

let lastUpdate = getProcessMs();
let tickNumber = 0;

loadMap('default');

setInterval(() => {
  const now = getProcessMs();
  const delta = now - lastUpdate;
  tick(delta);
  lastUpdate = now;
  tickNumber++;
}, 1000 / TICK_RATE);
