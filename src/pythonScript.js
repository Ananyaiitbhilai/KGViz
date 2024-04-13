const { PythonShell } = require('python-shell');

const runPythonScript = (text) => {
  return new Promise((resolve, reject) => {
    let options = {
      mode: 'text',
      pythonPath: '', // Replace with the path to your Python installation if necessary
      scriptPath: './LLM/LLMtriple.py', // Path to your Python script
      args: [text] // Pass the text as an argument to the Python script
    };

    PythonShell.run('extract_triples', options, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(results[0]));
      }
    });
  });
};

export default runPythonScript;