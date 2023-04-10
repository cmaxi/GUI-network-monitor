let locked = true;

function lockItem() {
  locked = true;
}

function unlockItem() {
  locked = false;
}

function isItemLocked() {
  return locked;
}

module.exports = { lockItem, unlockItem, isItemLocked };