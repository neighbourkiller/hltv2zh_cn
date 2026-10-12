import { walk } from './walker';

/** 最多一个 rAF 和一个兜底定时器；持续事件不会推迟已安排的执行。 */
export class Scheduler {
  private pending = new Map<Node, boolean>();
  private cursor?: Generator<Node>;
  private frame?: number;
  private timer?: number;
  private stopped = false;
  readonly metrics = { batches: 0, maxBatchMs: 0, maxPending: 0 };
  constructor(private process: (node: Node) => void, private budgetMs = 6) {}
  private covered(node: Node): boolean {
    for (let parent = node.parentNode; parent; parent = parent.parentNode) {
      if (this.pending.get(parent)) return true;
    }
    return false;
  }
  enqueue(node: Node, subtree = true): void {
    if (this.stopped || !node.isConnected) return;
    if (this.covered(node)) return;
    this.pending.set(node, subtree || this.pending.get(node) === true);
    this.metrics.maxPending = Math.max(this.metrics.maxPending, this.pending.size);
    this.schedule();
  }
  private schedule(): void {
    if (this.frame !== undefined || this.timer !== undefined || this.stopped) return;
    this.frame = window.requestAnimationFrame(() => this.run());
    this.timer = window.setTimeout(() => this.run(), 100);
  }
  private run(): void {
    this.cancelHandles();
    const start = performance.now();
    let count = 0;
    while (!this.stopped) {
      if (!this.cursor) {
        const entry = this.pending.entries().next().value;
        if (!entry) break;
        const [root, subtree] = entry;
        this.pending.delete(root);
        // 延迟裁掉被祖先覆盖的任务，入队成本与 DOM 深度相关，避免大量兄弟节点时 O(n²)。
        this.cursor = this.covered(root) ? (function* () {})()
          : subtree ? walk(root) : (function* () { yield root; })();
      }
      const next = this.cursor.next();
      if (next.done) this.cursor = undefined;
      else this.process(next.value);
      if (++count >= 300 || performance.now() - start >= this.budgetMs) break;
    }
    this.metrics.batches++;
    this.metrics.maxBatchMs = Math.max(this.metrics.maxBatchMs, performance.now() - start);
    if (this.cursor || this.pending.size) this.schedule();
  }
  private cancelHandles(): void {
    if (this.frame !== undefined) cancelAnimationFrame(this.frame);
    if (this.timer !== undefined) clearTimeout(this.timer);
    this.frame = this.timer = undefined;
  }
  stop(): void { this.stopped = true; this.cancelHandles(); this.pending.clear(); this.cursor = undefined; }
}
