from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier
import pandas as pd

def build_model():
    data = [
        ("CARREFOUR MARKET", "Food"),
        ("UBER TRIP", "Transport"),
        ("NETFLIX", "Entertainment"),
        ("ZARA", "Shopping"),
        ("STEG ELECTRICITE", "Bills"),
        ("VIREMENT SALAIRE", "Income"),
    ]

    df = pd.DataFrame(data, columns=['description', 'category'])

    vec = TfidfVectorizer(ngram_range=(1, 2))
    X = vec.fit_transform(df['description'])

    clf = RandomForestClassifier(n_estimators=100, random_state=42)
    clf.fit(X, df['category'])

    return vec, clf


# load once (IMPORTANT for performance)
VEC, CLF = build_model()


def predict_category(description):
    X = VEC.transform([description])
    return CLF.predict(X)[0]