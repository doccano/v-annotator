import IntervalTree from "@flatten-js/interval-tree";
import { Identifiable } from "../Label/Identifiable";

export class LevelManager {
  private intervalPerLevel: IntervalTree[] = [];
  private id2level: Map<number, number> = new Map(); // <id, level>

  update(item: Identifiable, ranges: [number, number][]): void {
    for (const [level, tree] of this.intervalPerLevel.entries()) {
      if (ranges.every((range) => !this.intersectAny(tree, range))) {
        ranges.forEach((range) => {
          tree.insert(range);
        });
        this.id2level.set(item.id, level);
        return;
      }
    }
    this.id2level.set(item.id, this.intervalPerLevel.length);
    const tree = new IntervalTree();
    ranges.forEach((range) => {
      tree.insert(range);
    });
    this.intervalPerLevel.push(tree);
  }

  private intersectAny(tree: IntervalTree, range: [number, number]): boolean {
    const res = tree.search(range);
    return (
      res.filter((r) => !(r[0] === range[1] || r[1] === range[0])).length > 0
    );
  }

  fetchLevel(item: Identifiable): number | undefined {
    return this.id2level.get(item.id);
  }

  get maxLevel(): number {
    return Math.max(Math.max(...this.id2level.values()) + 1, 0);
  }

  clear(): void {
    this.intervalPerLevel = [];
    this.id2level.clear();
  }
}
