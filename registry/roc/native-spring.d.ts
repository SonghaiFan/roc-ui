export interface Spring { stiffness?: number; damping?: number; mass?: number; fps?: number }
export function sampleSpring(from:number,to:number,velocity:number,seconds:number,options?:Spring):{position:number;velocity:number};
export function springFrames(from:Record<string,number>,to:Record<string,number>,velocity?:Record<string,number>,options?:Spring):{time:number;values:Record<string,number>;velocity:Record<string,number>}[];
export function nativeMotionSpring(kind:string,random?:()=>number):Spring;
