import differenceBy from "lodash/differenceBy";
import IntervalTree from "@flatten-js/interval-tree";
import { EntityObserver, EntityObserverHint } from "../Line/Observer";

export class Entity {
  constructor(
    readonly id: number,
    readonly label: number,
    readonly user: number,
    readonly startOffset: number,
    readonly endOffset: number
  ) {}

  isIn(startOffset: number, endOffset: number): boolean {
    return (
      (startOffset <= this.startOffset && this.startOffset < endOffset) ||
      (startOffset < this.endOffset && this.endOffset <= endOffset) ||
      (this.startOffset < startOffset && endOffset < this.endOffset)
    );
  }
}

export abstract class EntitySubject {
  private observers: EntityObserver[] = [];

  register(observer: EntityObserver): void {
    this.observers.push(observer);
  }

  notify(entities: Entities, hint: EntityObserverHint): void {
    for (const observer of this.observers) {
      observer.update(entities, hint);
    }
  }
}

export class Entities extends EntitySubject {
  private tree: IntervalTree<Entity> = new IntervalTree();
  private start2entity: { [key: number]: Entity[] } = {};

  constructor(entities: Entity[]) {
    super();
    for (const entity of entities) {
      this.tree.insert([entity.startOffset, entity.endOffset], entity);
      this.addStart2Entity(entity);
    }
  }

  static valueOf(entities: Entity[]): Entities {
    return new Entities(
      entities.map(
        (entity) =>
          new Entity(
            entity.id,
            entity.label,
            entity.user,
            entity.startOffset,
            entity.endOffset
          )
      )
    );
  }

  get size(): number {
    return this.tree.size;
  }

  isEmpty(): boolean {
    return this.size === 0;
  }

  delete(entity: Entity): void {
    this.tree.remove([entity.startOffset, entity.endOffset], entity);
    this.start2entity[entity.startOffset] = this.start2entity[
      entity.startOffset
    ].filter((e) => e.id !== entity.id);
  }

  add(entity: Entity): void {
    this.tree.insert([entity.startOffset, entity.endOffset], entity);
    this.addStart2Entity(entity);
  }

  replace(oldEntity: Entity, newEntity: Entity): void {
    this.delete(oldEntity);
    this.add(newEntity);
  }

  private addStart2Entity(entity: Entity): void {
    if (!(entity.startOffset in this.start2entity)) {
      this.start2entity[entity.startOffset] = [];
    }
    this.start2entity[entity.startOffset].push(entity);
  }

  update(others: Entity[]): void {
    const oldEntities = this.list();
    const newMapping: { [key: number]: Entity } = {};
    for (let i = 0; i < others.length; i++) {
      newMapping[others[i].id] = others[i];
    }
    // delete entities
    const oldMapping: { [key: number]: Entity } = {};
    for (let i = 0; i < oldEntities.length; i++) {
      const entity = oldEntities[i];
      oldMapping[entity.id] = entity;
      if (!(entity.id in newMapping)) {
        this.delete(entity);
        this.notify(this, { entity, mode: "delete" });
      }
    }
    // add or update entities
    for (let i = 0; i < others.length; i++) {
      const entity = others[i];
      if (entity.id in oldMapping) {
        const other = oldMapping[entity.id];
        if (
          !(
            entity.label === other.label &&
            entity.startOffset === other.startOffset &&
            entity.endOffset === other.endOffset
          )
        ) {
          this.replace(other, entity);
          this.notify(this, { entity, mode: "update" });
        }
      } else {
        this.add(entity);
        this.notify(this, { entity, mode: "add" });
      }
    }
  }

  getAt(startOffset: number): Entity[] {
    if (startOffset in this.start2entity) {
      return this.start2entity[startOffset];
    } else {
      return [];
    }
  }

  startsAt(startOffset: number): boolean {
    const entities = this.getAt(startOffset);
    return entities.length !== 0;
  }

  list(): Entity[] {
    return this.tree.values;
  }

  filterByRange(startOffset: number, endOffset: number): Entity[] {
    return this.tree
      .search([startOffset, endOffset])
      .filter((entity: Entity) => entity.isIn(startOffset, endOffset));
  }
}

export class LevelManager {
  private endOffsetPerLevel: Map<number, number> = new Map(); // <level, endOffset>
  private entityLevel: Map<number, number> = new Map(); // <entity.id, level>

  update(entity: Entity): void {
    for (const [level, endOffset] of this.endOffsetPerLevel) {
      if (endOffset <= entity.startOffset) {
        this.endOffsetPerLevel.set(level, entity.endOffset);
        this.entityLevel.set(entity.id, level);
        return;
      }
    }
    this.endOffsetPerLevel.set(this.endOffsetPerLevel.size, entity.endOffset);
    this.entityLevel.set(
      entity.id,
      Math.max(Math.max(...this.entityLevel.values()) + 1, 0)
    );
  }

  fetchLevel(entity: Entity): number | undefined {
    return this.entityLevel.get(entity.id);
  }

  get maxLevel(): number {
    return Math.max(Math.max(...this.entityLevel.values()) + 1, 0);
  }

  clear(): void {
    this.endOffsetPerLevel.clear();
    this.entityLevel.clear();
  }
}
