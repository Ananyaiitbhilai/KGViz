import differenceBy from "lodash/differenceBy";
import { v4 as uuidv4 } from "uuid";

export const getDiffNodes = (newList, oldList) => {
  return differenceBy(newList, oldList, (node) => node.data.id);
};

export const getDiffEdges = (newList, oldList) => {
  return differenceBy(
    newList,
    oldList,
    (edge) => `${edge.data.source},${edge.data.target}`
  );
};

export const getNodeColor = (weight) => {
  const colors = [
    "#EF5350",
    "#EC407A",
    "#AB47BC",
    "#7E57C2",
    "#5C6BC0",
    "#42A5F5",
    "#29B6F6",
    "#26C6DA",
    "#26A69A",
    "#66BB6A",
    "#9CCC65",
    "#D4E157",
    "#FFEE58",
    "#FFCA28",
    "#FFA726",
    "#FF7043",
    "#8D6E63",
    "#8D6E63",
    "#78909C",
  ];
  return colors[weight % colors.length];
};

export const colorNodes = (nodes, nodeWeightMap) => {
  return nodes.map((node) => {
    return {
      data: {
        ...node.data,
        color: getNodeColor(nodeWeightMap[node.data.id]),
      },
    };
  });
};

export const generateNodeWeightMap = (edges, nodeWeightMap) => {
  const newNodeWeightMap = { ...nodeWeightMap };
  edges.forEach((edge) => {
    if (edge.data.source in newNodeWeightMap) {
      newNodeWeightMap[edge.data.source] += 1;
    } else {
      newNodeWeightMap[edge.data.source] = 0;
    }
    if (edge.data.target in newNodeWeightMap) {
      newNodeWeightMap[edge.data.target] += 1;
    } else {
      newNodeWeightMap[edge.data.target] = 0;
    }
  });
  return newNodeWeightMap;
};

export const restructureGraph = (data) => {
  const nodes = [];
  const edges = [];
  const nodeWeightMap = {};

  data.forEach((item) => {
    const { head, type, tail } = item;

    if (!nodeWeightMap.hasOwnProperty(head)) {
      nodeWeightMap[head] = 1;
    } else {
      nodeWeightMap[head] += 1;
    }
    if (!nodeWeightMap.hasOwnProperty(tail)) {
      nodeWeightMap[tail] = 1;
    } else {
      nodeWeightMap[tail] += 1;
    }

    if (!nodes.some((node) => node.data.id === head)) {
      nodes.push({
        data: {
          id: head,
          name: head,
          color: getNodeColor(nodeWeightMap[head]),
        },
      });
    }
    if (!nodes.some((node) => node.data.id === tail)) {
      nodes.push({
        data: {
          id: tail,
          name: tail,
          color: getNodeColor(nodeWeightMap[tail]),
        },
      });
    }

    edges.push({
      data: {
        id: uuidv4(),
        source: head,
        target: tail,
        label: type,
      },
    });
  });

  return { nodes, edges };
};

export const exportData = (graphEdges) => {
  const data = graphEdges.map((edge) => {
    return {
      source: edge?.data?.source,
      relation: edge?.data?.label,
      target: edge?.data?.target,
    };
  });

  const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
    JSON.stringify(data)
  )}`;
  const link = document.createElement("a");
  link.href = jsonString;
  link.download = "data.json";

  link.click();
};
