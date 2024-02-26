# import joblib
import os

import joblib
import pandas as pd
# import pickle
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score


def main():
    # PhishとTargetの、特徴量と正解ラベルのデータ
    data_phish = pd.read_csv("./feature_phish.csv")
    data_target = pd.read_csv("./feature_target.csv")

    # 訓練データ
    train_phish = data_phish.sample(frac=0.7)
    train_target = data_target.sample(frac=0.7)
    train = pd.concat([train_phish, train_target], ignore_index=True) * 1  # 1をかけてbool->int変換
    train["Label"] = pd.factorize(train["Label"])[0]  # factorizeでlabel->int変換

    # テストデータ
    test_phish = data_phish.drop(train_phish.index)
    test_target = data_target.drop(train_target.index)
    test = pd.concat([test_phish, test_target], ignore_index=True) * 1  # 1をかけてbool->int変換
    test["Label"] = pd.factorize(test["Label"])[0] * 1  # factorizeでlabel->int変換

    # 訓練データを特徴量とラベルに分割
    x_train = train[["GA", "Copy", "Script", "ExtLink"]]
    y_train = train["Label"]

    # テストデータを特徴量とラベルに分割
    x_test = test[["GA", "Copy", "Script", "ExtLink"]]
    y_test = test["Label"]

    # モデルを作成
    model = RandomForestClassifier()
    # 訓練
    model.fit(x_train, y_train)

    # テストデータの推測
    test = model.predict(x_test)
    # 正解率の計算
    score = accuracy_score(test, y_test)

    print(f"正解率: {score * 100}%")

    joblib.dump(model, "./model.pkl", compress=3)


if __name__ == '__main__':
    main()
