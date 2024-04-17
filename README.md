# KGViz Tool
This innovative application harnesses the power of local open-source Large Language Models (LLMs) to revolutionize the way we visualize and understand complex data. By extracting meaningful triples from unstructured text, the app constructs intricate knowledge graphs that reveal the hidden connections and insights within the data. The approach employed in the backend got accepted at the Text2KG 2024 workshop at the Extended Semantic Web Conference (ESWC), this tool stands at the forefront of semantic technology, offering a unique approach to data analysis and representation. This tool is an extension of the framework/code submitted at Text2KG.

The application's core functionality lies in its ability to parse through vast amounts of text and intelligently identify relationships between entities, effectively transforming raw information into a structured and interactive knowledge graph. This not only enhances the accessibility of data but also provides a more engaging and intuitive way for users to explore and interpret the underlying patterns and trends. Whether for academic research, business intelligence, or personal use, this application offers a cutting-edge solution for anyone looking to unlock the full potential of their data through the power of LLM-driven knowledge graph visualization. 

It transforms text into RDF triples, which are then visually differentiated based on their occurrence frequency. This method results in a vibrant and informative display that not only enhances data comprehension but also adds an aesthetic dimension to the analysis. Users can effortlessly download these RDF triples in a JSON format, facilitating seamless integration and further analytical exploration. This feature ensures that the data is not only visually appealing but also practical and ready for use in various applications, from data science projects to software development.

### Features
- Inverse relations
- Transitive relations
- Negation handling
- Event identification
- Mitigating biases, class imbalance
- Generalising well on every type of data

https://github.com/Ananyaiitbhilai/KGViz/assets/65886348/720435f5-11aa-4f88-a81a-1f96dddf3e06

## Architecture
- The backend runs on a Flask App located at `src\LLM`
- The Frontend uses React

## Requirements
- For running the backend app, please refer to `src\LLM\requirements.txt`. Create a virtual environment to install all the dependecies. `Python version >= 3.8`
- In backend only, you might need to have LLMs downloaded locally in gguf Format.
- For Frontend
  1. `npm >= v7.19.1`
  2. `node >= v14.17.4`


## How to run
#### Starting Backend
1. Open CLI/terminal, activate virtual environment with all the required dependencies installed.
2. Navigate to Flask app at `src\LLM`, run command `python LLMtriple.py`
3. You have started the Flask app the API shall be accessible at `http://localhost:8001/extract_triples`.
4. Please note, in `LLMtriple.py` file you should give path of your downloaded LLM (gguf format only).

The backend returns triples in the format of JSON objects:
```
[
  {
    'head': 'Ananya',
    'type': 'studies at',
    'tail': 'IIT Bhilai'
  },
  {
    'head': 'Arunya',
    'type': 'does not study at',
    'tail': 'IIT Bhilai'
  }
]
```
#### Starting Frontend
1. Open another CLI/terminal concurrently, and run `npm install`
2. Then, run `npm run start` to start the project and navigate to `localhost:3000`
4. Add your `Prompt` and hit `Generate`.
5. The graph will be populated after few seconds.
6. Click on `Export JSON` to save the generated triples in RDF format.

___
Note: - You can find more on backend of this project at https://github.com/Ananyaiitbhilai/Text2Triple-LLM-Agent. The frontend/UI of this project is inspired from https://github.com/iAmmarTahir/KnowledgeGraphGPT.







