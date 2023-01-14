import { ATTACK, CARRY, ERR_NOT_IN_RANGE, MOVE, RANGED_ATTACK, RESOURCE_ENERGY, WORK } from "game/constants";
import { Creep, Source, StructureSpawn, } from "game/prototypes";
import { getObjectsByPrototype } from "game/utils";


let bodyParts = [WORK, ATTACK];
const [spawnPoint] = getObjectsByPrototype(StructureSpawn);
const [energySource] = getObjectsByPrototype(Source);
var count;

const PARTS = {
  0: WORK,
  1: WORK
}

export function loop() {
  if (!count) {
    spawn();
    count = true;
  }

  const myCreeps = getObjectsByPrototype(Creep).filter((creep) => creep.my);

  myCreeps.forEach(work);
}

function spawn() {
  const i = Math.round(Math.random())

  spawnPoint.spawnCreep([MOVE, CARRY, PARTS[i]]);
}

function work(creep) {
  if (creep.body.some((bodyPart) => bodyPart.type == ATTACK)) {
    attack(creep);
  }

  if (creep.body.some((bodyPart) => bodyPart.type == WORK)) {
    harvestEnergy(creep)
  }
}

function harvestEnergy(creep) {
  // const workers = getObjectsByPrototype(Creep).filter((creep) => {
  //   const isWorker = Boolean(creep.body.find((body) => body.type === WORK))

  //   return creep.my && isWorker;
  // });


  
  if (creep.store.getFreeCapacity(RESOURCE_ENERGY)) {
    if (creep.harvest(energySource) === ERR_NOT_IN_RANGE) {
      creep.moveTo(energySource);
    }
  } else {
    const transferRes = creep.transfer(spawnPoint, RESOURCE_ENERGY);

    if (transferRes == ERR_NOT_IN_RANGE) {
      creep.moveTo(spawnPoint);
    }
  }

}

function attack(creep) {
  let enemyCreep = getObjectsByPrototype(Creep).find(creep => !creep.my);

  if (creep.attack(enemyCreep) == ERR_NOT_IN_RANGE) {
    creep.moveTo(enemyCreep);
  }
  
}

function getCreepType() {

}