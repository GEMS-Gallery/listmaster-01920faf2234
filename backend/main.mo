import Bool "mo:base/Bool";
import Text "mo:base/Text";

import Nat "mo:base/Nat";
import Array "mo:base/Array";

actor {

  stable var nextId : Nat = 1;
  stable var items : [Item] = [];

  type Item = {
    id : Nat;
    name : Text;
    category : Text;
    completed : Bool;
  };

  public func addItem(name : Text, category : Text) : async Item {
    let item = {
      id = nextId;
      name = name;
      category = category;
      completed = false;
    };
    items := Array.append<Item>(items, [item]);
    nextId += 1;
    return item;
  };

  public func markCompleted(id : Nat) : async Bool {
    var found = false;
    items := Array.map<Item, Item>(items, func (item) {
      if (item.id == id) {
        found := true;
        { id = item.id; name = item.name; category = item.category; completed = not item.completed };
      } else {
        item;
      }
    });
    return found;
  };

  public func deleteItem(id : Nat) : async Bool {
    let originalLength = items.size();
    items := Array.filter<Item>(items, func (item) { item.id != id });
    return items.size() < originalLength;
  };

  public query func getItems() : async [Item] {
    return items;
  };

}
