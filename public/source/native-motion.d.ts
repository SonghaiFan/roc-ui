export function captureRects(nodes:Map<string,HTMLElement>):Map<string,unknown>;
export function animateLayout(nodes:Map<string,HTMLElement>,before:Map<string,unknown>,options?:{spring?:object|((id:string,node:HTMLElement)=>object);duration?:number;preserveVelocity?:boolean}):Promise<unknown>;
