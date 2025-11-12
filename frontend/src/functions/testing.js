export function getLocalStorageUsage() {
  let total = 0;
  const details = [];

  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      const value = localStorage.getItem(key);
      const size = (key.length + value.length) * 2;

      total += size;
      details.push({ key, sizeKB: (size / 1024).toFixed(2) + " KB" });
    }
  }

  const totalKB = (total / 1024).toFixed(2);
  const totalMB = (total / (1024 * 1024)).toFixed(2);

  const maxMB = 5;
  const remainingMB = maxMB - total / (1024 * 1024);

  console.table(details);
  console.log(`Total used: ${totalKB} KB (${totalMB} MB)`);
  console.log(`Estimated remaining: ${remainingMB.toFixed(2)} MB`);
}
