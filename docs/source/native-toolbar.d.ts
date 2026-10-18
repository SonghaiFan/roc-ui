export interface ToolbarOptions { editor:HTMLElement; onFormat:(command:string)=>void; getFormatState?:(command:string)=>boolean; id?:string; isActive?:()=>boolean }
export function createNotesToolbar(options:ToolbarOptions):{element:HTMLDivElement;update():void;destroy():void};
