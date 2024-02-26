import joblib
import pandas as pd
from sklearn.ensemble import RandomForestClassifier


def main():
    # feature_ga
    # feature_copy
    # feature_script
    # feature_extLink

    # モデルを読み込み
    model: RandomForestClassifier = joblib.load("./model.pkl")

    # 推測
    test = model.predict(pd.DataFrame([[ga, copy, script, extLink]], columns=["GA", "Copy", "Script", "ExtLink"]))

    print(test[0])  # フィッシング:0, 正規:1


if __name__ == '__main__':
    main()
