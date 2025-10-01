const storage = {
  get: async (key: string): Promise<string | null> => {
    return Promise.resolve(localStorage.getItem(key));
  },

  set: async (key: string, value: string): Promise<void> => {
    localStorage.setItem(key, value);
    return Promise.resolve();
  },

  remove: async (key: string): Promise<void> => {
    localStorage.removeItem(key);
    return Promise.resolve();
  },

  keys: {
    char: "ndx:CHAR",
  },
};

export default storage;
