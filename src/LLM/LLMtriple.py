from flask import Flask, request, jsonify
from flask_cors import CORS
from llama_cpp import Llama
import ast
import spacy
import string
from langchain.callbacks.manager import CallbackManager
from langchain.callbacks.streaming_stdout import StreamingStdOutCallbackHandler

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes and origins

callback_manager = CallbackManager([StreamingStdOutCallbackHandler()])

# Load the English language model
nlp = spacy.load("en_core_web_sm")

llm = Llama(model_path="/Users/ananyahooda/.cache/lm-studio/models/TheBloke/Mistral-7B-Instruct-v0.2-GGUF/mistral-7b-instruct-v0.2.Q4_K_S.gguf",  
            n_ctx=2048,
            n_gpu_layers=-1,
            n_batch=512,
            callback_manager=callback_manager,
            verbose=True)

prompt_template = '''<s>[INST] <<SYS>>
Assistant is an expert JSON builder designed to assist with a tasks of Triple extraction from text.

Assistant is able to extract triples from the text.

Assistant returns the response as the list of dictionaries only always and dictionaries consisting of keys called "head", "type" and "tail" in ever dictionary in the list

Here are some previous conversations between the Assistant and User:

User: Hey how are you today?
Assistant: I'm good thanks, how are you?
User: Can you extract all the triplets from this text: John Wilkes Booth , who assassinated President Lincoln , was an actor .
Assistant:  [{{"head": "President Lincoln", "type": "killed by", "tail": "John Wilkes Booth"}}]
User: Also give triples for text: "Marie Magdefrau Ferraro , 50 , of Bethany , Conn. , was shot to death Thursday when two bandits armed with assault rifles emerged from nearby bushes and began firing at a van carrying a Connecticut Audubon Society wildlife wild tour group .
Assistant: [{{"head": "Marie Magdefrau Ferraro", "type": "residence", "tail": "Bethany"}}, {{"head": "Marie Magdefrau Ferraro", "type": "residence", "tail": "Conn." }},{{"head": "Bethany", "type": "location", "tail": "Conn."}}] 
User: Thanks, Bye!
Assistant: See you later, the Chat is closed.
<</SYS>>

{0}[/INST]'''

def process_command1(command):
    # Put user command into prompt
    prompt = prompt_template.format("User: " + command)
    # Send command to the model
    output = llm(prompt, max_tokens=2000, stop=["User:"])
    response = (output['choices'][0]['text']).strip()
    try:
        response = ast.literal_eval(response)
    except Exception as e:
        print(e)
    # No json match, just return response
    return response 

def extract_triples(text):
    # Process the text
    doc = nlp(text)

    # Create an empty list to store the sentences
    sentences = []

    # Iterate over the sentences in the document and append them to the list
    for sent in doc.sents:
        # Remove punctuation marks and escape characters from the sentence
        sentence = sent.text.translate(str.maketrans("", "", string.punctuation))
        sentence = sentence.replace("\n", "").replace("\r", "").replace("\t", "")
        sentences.append(sentence)

    # Extract triples for each sentence
    triples = []
    for sentence in sentences:
        triple = process_command1(f"Extract triples for text: {sentence}")
        triples.extend(triple)

    return triples

@app.route('/extract_triples', methods=['GET', 'POST'])
def extract_triples_api():
    if request.method == 'POST':
        text = request.json['text']
    else:
        text = request.args.get('text', '')
    triples = extract_triples(text)
    return jsonify(triples)

if __name__ == '__main__':
    app.run(debug=True, port=8001)
