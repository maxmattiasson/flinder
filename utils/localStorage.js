export const createStorage = (key) => ({
  load() {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  save(data) {
    localStorage.setItem(key, JSON.stringify(data));
  },

  add(item) {
    const data = this.load();
    data.push(item);
    this.save(data);
  },

  remove(predicate) {
    const data = this.load().filter((x) => !predicate(x));
    this.save(data);
  },

  clear() {
    localStorage.removeItem(key);
  },
});

export const GuestVotes = createStorage("guestVotes");
export const GuestProgress = createStorage("guestProgress");
export const ViewedMovies = createStorage("viewedMovies");
