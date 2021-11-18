import math
import sys

from sklearn.feature_extraction.text import TfidfVectorizer
import pandas as pd
from itertools import chain

def start():
    documentString = []

    for document in sys.argv[1:]:
        documentString.append(document)

    vectorized = TfidfVectorizer(max_df=.65, min_df=2, stop_words=["an", "and", "of", "or"], use_idf=True, norm=None, )
    transformed_documents = vectorized.fit_transform(documentString)
    transformed_documents_as_array = transformed_documents.toarray()
    docsWithRelevantWords = []
    for counter, doc in enumerate(transformed_documents_as_array):
        tf_idf_tuples = list(zip(vectorized.get_feature_names_out(), doc))
        one_doc_as_df = pd.DataFrame.from_records(tf_idf_tuples, columns=['term', 'score']).sort_values(by='score',
                                                                                                        ascending=False).reset_index(
            drop=True)
        docRelevantWords = []
        for index, row in one_doc_as_df.iterrows():
            for i in range(math.floor(row["score"])):
                docRelevantWords.append(row["term"])
            if index > 300:
                break
        docsWithRelevantWords.append(docRelevantWords)

    print(str(list(chain.from_iterable(docsWithRelevantWords))))


if __name__ == '__main__':
    start()
