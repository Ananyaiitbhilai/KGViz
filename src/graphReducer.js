import { ACTIONS } from "./actions";
import { colorNodes, generateNodeWeightMap } from "./util";

export const initialState = {
  nodes: [],
  edges: [],
  nodeWeightMap: {},
};

export const graphReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.ADD_NODES_AND_EDGES:
      console.log("ADD_NODES_AND_EDGES action triggered with payload:", action.payload);
      const newNodes = action.payload.nodes;
      const newEdges = action.payload.edges;
      const edges = [...state.edges, ...newEdges];
      console.log("Updated graph state:", newEdges);
      const newNodeWeightMap = generateNodeWeightMap(edges, state.nodeWeightMap);
      const coloredNodes = colorNodes([...state.nodes, ...newNodes], newNodeWeightMap);

      return {
        nodes: [...coloredNodes],
        edges: [...edges],
        nodeWeightMap: newNodeWeightMap,
      };
    case ACTIONS.CLEAR_GRAPH:
      return initialState;
    default:
      return state;
  }
};
