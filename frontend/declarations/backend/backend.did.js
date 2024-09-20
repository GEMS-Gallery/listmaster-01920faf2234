export const idlFactory = ({ IDL }) => {
  const Item = IDL.Record({
    'id' : IDL.Nat,
    'name' : IDL.Text,
    'completed' : IDL.Bool,
  });
  return IDL.Service({
    'addItem' : IDL.Func([IDL.Text], [Item], []),
    'deleteItem' : IDL.Func([IDL.Nat], [IDL.Bool], []),
    'getItems' : IDL.Func([], [IDL.Vec(Item)], ['query']),
    'markCompleted' : IDL.Func([IDL.Nat], [IDL.Bool], []),
  });
};
export const init = ({ IDL }) => { return []; };
