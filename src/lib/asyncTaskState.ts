type TaskState = Map<Promise<any>, boolean>;
type Waiter = (value: void) => void;
export class AsyncTaskState {
    protected taskMap: TaskState = new Map();
    protected waiters = new Set<Waiter>();

    add<T>(asyncTask: Promise<T>) {
        this.taskMap.set(asyncTask, false);
        asyncTask.then(() => {
            this.taskMap.set(asyncTask, true);
            this.checkState();
        });
        return asyncTask;
    }

    protected checkState() {
        if (this.isCompleted()) {
            Array.from(this.waiters.values()).forEach((waiter) => waiter());
            this.waiters.clear();
        }
    }

    isCompleted() {
        const tasks = Array.from(this.taskMap.values());
        if (tasks.length == 0) return true;
        else return tasks.every((state) => state == true);
    }

    wait() {
        if (this.isCompleted()) return Promise.resolve();

        const promise = new Promise((resolve: Waiter) => {
            this.waiters.add(resolve);
        });
        return promise;
    }
}
