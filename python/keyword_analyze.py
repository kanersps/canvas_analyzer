import sys
from string import punctuation

import spacy
from spacy.tokenizer import ORTH

def start():
    result = []
    nlp = spacy.load("en_core_web_sm")
    pos_tag = ['PROPN', 'NOUN']

    special_case = [{ORTH: "open-source"}]
    nlp.tokenizer.add_special_case("open-source", special_case)

    doc = nlp(sys.argv[len(sys.argv) - 1])

    prev_token = None;

    for token in doc:
        if token.pos_ in pos_tag:
            if prev_token.pos_ == "ADJ":
                result.append(prev_token.text + " " + token.text)
            else:
                result.append(token.text)

        prev_token = token

    print(result)


if __name__ == '__main__':
    start()
