export type VoiceControl = HTMLDivElement & { update(item:{audioUrl?:string}):void; dispose():void };
export function createVoiceControls(item:{audioUrl?:string},players:Set<()=>void>):VoiceControl;
