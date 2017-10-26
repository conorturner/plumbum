export declare class Stream<T> {
    constructor();

    write(array: Array<T>): Stream<T>;
    push(item: T): Stream<T>;
    map(transform: Function): Stream<T>;
    map(concurrency: number, transform: Function): Stream<T>;
    forEach(transform: Function): Stream<T>;
    toArray(transform: Function): Promise<Array<T>>;
    onEnd(): Promise<number>;

}
