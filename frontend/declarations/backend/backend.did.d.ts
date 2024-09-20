import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Item {
  'id' : bigint,
  'name' : string,
  'completed' : boolean,
  'category' : string,
}
export interface _SERVICE {
  'addItem' : ActorMethod<[string, string], Item>,
  'deleteItem' : ActorMethod<[bigint], boolean>,
  'getItems' : ActorMethod<[], Array<Item>>,
  'markCompleted' : ActorMethod<[bigint], boolean>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
