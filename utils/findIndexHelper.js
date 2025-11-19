export function findCurrIndexHelper(position, PAGE_SIZE) {
  const currPage = Math.floor(position / PAGE_SIZE) + 1;
  const currentIndex = position % PAGE_SIZE;
  return { currPage, currentIndex };
}
