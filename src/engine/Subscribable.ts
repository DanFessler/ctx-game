class Subscribable {
  private subscribers = new Set<() => void>();

  subscribe = (callback: () => void): (() => void) => {
    this.subscribers.add(callback);
    return () => {
      this.subscribers.delete(callback);
    };
  };

  updateSubscribers() {
    this.subscribers.forEach((callback) => callback());
  }
}

export default Subscribable;
