const cache = new Map();

export const fetchNodes = async (nodeId) => {
  if (cache.has(nodeId)) {
    return cache.get(nodeId);
  }
  const res = await fetch(
    `https://zl3m4qq0l9.execute-api.ap-northeast-2.amazonaws.com/dev/${
      nodeId ? nodeId : ""
    }`
  );
  if (!res.ok) {
    throw new Error("Server Error");
  }
  const nodes = await res.json();
  cache.set(nodeId, nodes);
  return nodes;
};
