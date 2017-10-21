export declare class Stream<T> {
    private buffer;
    constructor();

    write(array: Array<T>): Stream<T>;
    push(item: T): Stream<T>;

}
