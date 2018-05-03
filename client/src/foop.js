//import * as firebase from 'firebase'

class Foop {
  constructor(root, key) {
    this.foop = {
      root: root,
      key: key,
      ref: root.child(key),
      read: false,
    };
    console.log("ref", this.foop.ref);
    this.foop.ref.on('value', snap => {
      this.hydrate(snap.val());
      this.foop.read = true;
    });
  }

  save(recursive = false) {
    if (!this.foop.read) {
      console.log("Can't save, since haven't read.");
      return;
    }
    const json = this.dehydrated();
    delete json.foop;
    console.log(json);
    this.foop.ref.set(json);
  }

  chroot(root) {
    this.foop.root = root;
    save(true);
  }
}
export default Foop;

import Foop from './foop';
class Leeg extends Foop {
  hydrate(json) {
    this.name = json.name;
    this.nick = false;
    if ('nick' in json) this.nick = json.nick;
    this.year = json.year;

    this.divisions = json.divisions.map(id => new Divvy(this.foop.base, id));
    // this.schedule = new Schedule(json.schedule, db);
  }
  dehydrated(json) {
    return Object.assign({}, this);
  }
}
class Divvy extends Foop {
  hydrate(json) {
    this.name = json.name;
    this.nick = false;
    if ('nick' in json) this.nick = json.nick;
  }
  dehydrated(json) {
    return Object.assign({}, this);
  }
}

/*
 const root = firebase.database().ref(this.key())
 const leeg = new Leeg(root, '1');
 setTimeout(() => {
   console.log(leeg);
 }, 5000);
*/        
