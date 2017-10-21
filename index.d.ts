export declare class Stream<T> {
    private buffer;
    constructor();

    write(array: Array<T>): Stream<T>;
    push(item: T): Stream<T>;
    map(transform: Function): Stream<T>;
    forEach(transform: Function): Stream<T>;
    toArray(transform: Function): Promise<Array<T>>;
    end();
    onEnd(): Promise<number>;

}
