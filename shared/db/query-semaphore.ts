export interface QuerySemaphore {
  run<T>(task: () => Promise<T>): Promise<T>;
}

/**
 * Limits how many Prisma queries run at once per process.
 * Extra callers wait in-memory instead of exhausting the Neon pooler.
 */
export function createQuerySemaphore(maxConcurrent: number): QuerySemaphore {
  const limit = Math.max(1, maxConcurrent);
  let active = 0;
  const queue: Array<() => void> = [];

  const drain = (): void => {
    while (active < limit && queue.length > 0) {
      const next = queue.shift();
      if (next) {
        next();
      }
    }
  };

  return {
    run<T>(task: () => Promise<T>): Promise<T> {
      return new Promise<T>((resolve, reject) => {
        const execute = (): void => {
          active += 1;
          task()
            .then(resolve, reject)
            .finally(() => {
              active -= 1;
              drain();
            });
        };

        if (active < limit) {
          execute();
        } else {
          queue.push(execute);
        }
      });
    },
  };
}
