export type InteractionType = 'Inspect' | 'Open' | 'Pick up';
export type ObjectType = 'container' | 'item' | 'static';

export interface WorldObject {
  id: string;
  name: string;
  type: ObjectType;
  isOpen?: boolean;
  isHostile?: boolean;
}

export type EffectType = 'Poisoned' | 'Stunned' | 'Buffed';

export interface StatusEffect {
  id: string;
  type: EffectType;
  duration: number; // in seconds
  startTime: number; // timestamp
}

export type BodyPart = 'Head' | 'Hair' | 'Ears' | 'Face' | 'Body' | 'Clothes' | 'Hands' | 'Wrist' | 'Shoulder' | 'Elbow' | 'Feet' | 'Foot' | 'Legs' | 'Knee' | 'Fingers' | 'Palm' | 'Bones' | 'Ligaments';

export interface PlayerStats {
  hp: number;
  maxHp: number;
  status: 'healthy' | 'sick' | 'injured';
  inventory: {
    food: number;
    medicine: number;
  };
  money: number;
  isOtakuPlus: boolean;
  otakuPlusExpiry?: number; // timestamp
}
