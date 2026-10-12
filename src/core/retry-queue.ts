/** 限流到期重查节点，不缓存旧译文。节点级合并，最多 512 项、一个定时器。 */
export class RetryQueue {
  private pending = new Map<Node, number>();
  private timer?: number;
  private stopped = false;
  readonly metrics = { overflow: 0, retried: 0 };
  constructor(private enqueue: (node: Node) => void, private limit = 512) {}
  get size(): number { return this.pending.size; }
  add(node: Node, due: number): void {
    if (this.stopped || !node.isConnected) return;
    const previous = this.pending.get(node);
    // 同一元素的多个属性取最早到期时间；仍被限流的字段会再次预约。
    if (previous !== undefined && previous <= due) return;
    if (previous === undefined && this.pending.size >= this.limit) {
      for (const key of this.pending.keys()) if (!key.isConnected) this.pending.delete(key);
      if (this.pending.size >= this.limit) { this.metrics.overflow++; return; }
    }
    this.pending.set(node, due); this.schedule();
  }
  prune(): void {
    for (const node of this.pending.keys()) if (!node.isConnected) this.pending.delete(node);
    this.schedule();
  }
  private schedule(): void {
    if (this.timer !== undefined) window.clearTimeout(this.timer);
    this.timer = undefined;
    if (!this.pending.size || this.stopped) return;
    const due = Math.min(...this.pending.values());
    this.timer = window.setTimeout(() => {
      this.timer = undefined;
      const now = performance.now();
      for (const [node, deadline] of this.pending) {
        if (!node.isConnected) { this.pending.delete(node); continue; }
        if (deadline > now) continue;
        this.pending.delete(node); this.metrics.retried++; this.enqueue(node);
      }
      this.schedule();
    }, Math.max(1, Math.ceil(due - performance.now())));
  }
  clear(): void {
    if (this.timer !== undefined) window.clearTimeout(this.timer);
    this.timer = undefined; this.pending.clear();
  }
  stop(): void { this.stopped = true; this.clear(); }
}
