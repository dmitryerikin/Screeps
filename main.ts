import { ATTACK, ERR_NOT_IN_RANGE, MOVE, RANGED_ATTACK, RESOURCE_ENERGY, WORK } from "game/constants";
import { Creep, StructureSpawn, BodyPartType, Source } from "game/prototypes";
import { getObjectsByPrototype } from "game/utils";


let bodyParts: BodyPartType[] = [ATTACK, WORK];

function getCreepType() {
  
}

const [spawnPoint] = getObjectsByPrototype(StructureSpawn);
const [energySource] = getObjectsByPrototype(Source);

export function loop() {
  spawn();

  const myCreeps = getObjectsByPrototype(Creep).filter((creep) => creep.my);

  myCreeps.forEach(work);
}


function spawn() {
  for (let type of bodyParts) { 
    spawnPoint.spawnCreep([MOVE, type]);
  }
}

function work(creep: Creep) {
  if (creep.body.some((bodyPart) => bodyPart.type == ATTACK)) {
    attack(creep);
  }

  if (creep.body.some((bodyPart) => bodyPart.type == WORK)) {
    harvestEnergy(creep)
  }
}

function harvestEnergy(creep: Creep) {
  if (creep.store?.getFreeCapacity(RESOURCE_ENERGY)) {
    if (creep.harvest(energySource) === ERR_NOT_IN_RANGE) {
      creep.moveTo(energySource);
    }
  } else {
    if (creep.transfer(spawnPoint, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
      creep.moveTo(spawnPoint);
    }
  }
}

function attack(creep: Creep) {
  let enemyCreep = getObjectsByPrototype(Creep).find(creep => !creep.my);

  if (creep.attack(enemyCreep) == ERR_NOT_IN_RANGE) {
    creep.moveTo(enemyCreep);
  }
}