import { useReducer, useState } from "react";
import axios from 'axios';
import Graph from "./Graph";
import { graphReducer, initialState } from "./graphReducer";
import { ACTIONS } from "./actions";
import { exportData, restructureGraph } from "./util";
import "./App.css";
import { LAYOUTS } from "./constants";
import GithubLogo from "./github-mark.png";
import LayoutSelector from "./LayoutSelector";

function App() {
  const [prompt, setPrompt] = useState("");
  const handlePromptChange = (e) => {
    setPrompt(e.target.value);
  };

  const [graphState, dispatch] = useReducer(graphReducer, initialState);

  const [option, setOptions] = useState(LAYOUTS.FCOSE);

  const [loading, setLoading] = useState(false);

  const [file, setFile] = useState("");

  const handleJSONImport = (e) => {
    const fileReader = new FileReader();
    fileReader.readAsText(e.target.files[0], "UTF-8");
    fileReader.onload = (e) => {
      let data;
      try {
        data = JSON.parse(e.target.result);
      } catch (err) {
        console.info(err);
      }
      setFile(null);
      const result = restructureGraph(data);

      dispatch({ type: ACTIONS.ADD_NODES_AND_EDGES, payload: result });
    };
  };

  const fetchGraph = async (query) => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8001/extract_triples', { text: query });
      const data = response.data;
  
      console.log("Data from extract_triples:", data);
      const result = restructureGraph(data);
      console.log("Restructured graph:", result);
      dispatch({ type: ACTIONS.ADD_NODES_AND_EDGES, payload: result });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    fetchGraph(prompt);
  };

  return (
    <div className="App">
      <div className="mainContainer">
        <h1 className="title">KGViz</h1>
        <p className="text">
          The project aims to utilize a local open-source LLM based agents to convert
          unstructured text data into a structured knowledge graph
          representation.
        </p>
        <input
          type="text"
          onChange={(e) => handlePromptChange(e)}
          value={prompt}
          className="promptInput"
          placeholder="Enter your prompt"
        />

        <button
          onClick={handleSubmit}
          className="submitButton"
          disabled={loading}
        >
          {loading ? "Loading" : "Generate"}
        </button>
        <br />

        <div className="buttonContainer">
          <button
            className="submitButton"
            style={{ marginLeft: 5 }}
            onClick={() => dispatch({ type: ACTIONS.CLEAR_GRAPH })}
          >
            Clear
          </button>
          <button
            className="submitButton"
            style={{ marginLeft: 5 }}
            onClick={() => exportData(graphState?.edges)}
            disabled={graphState?.edges?.length < 1}
          >
            Export JSON
          </button>
          <label className="custom-file-upload">
            <input
              type="file"
              accept=".json"
              onChange={handleJSONImport}
              value={file}
            />
            Import JSON
          </label>
          <LayoutSelector option={option} setOptions={setOptions} />
        </div>
      </div>
      <Graph data={graphState} layout={option} />
      <div className="footer">
        <p>Copyrights © {new Date().getFullYear()}</p>
        <a
          href="https://github.com/Ananyaiitbhilai/KGViz/tree/main"
          target="_blank"
          rel="noreferrer"
        >
          <img
            src={GithubLogo}
            alt="github"
            width={20}
            height={20}
            className="github"
          />
        </a>
      </div>
    </div>
  );
}

export default App;
