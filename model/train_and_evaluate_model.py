import logging
import os
from pprint import pprint

import numpy as np

# 余計なログを消す設定
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"

import pandas as pd
import tensorflow as tf
import tensorflow_decision_forests as tfdf
import tensorflowjs as tfjs
from tf_keras import metrics
from pandas import DataFrame
from sklearn.model_selection import StratifiedKFold

# 余計なログを消す設定
tf.get_logger().setLevel(logging.ERROR)


def print_result(name: str, value: float):
    def bad():
        print(f"{name}: \033[31m{value:.4f}\033[0m")

    def fair():
        print(f"{name}: \033[33m{value:.4f}\033[0m")

    def good():
        print(f"{name}: \033[32m{value:.4f}\033[0m")

    def print_case(th: list[float]):
        if th[0] <= value:
            good()
        elif th[1] <= value < th[0]:
            fair()
        else:
            bad()

    if "accuracy" in name:
        print_case([0.9, 0.8])
    elif "precision" in name:
        print_case([0.9, 0.8])
    elif "recall" in name:
        print_case([0.9, 0.8])
    elif "f1" in name:
        print_case([0.9, 0.8])
    elif "auc" in name:
        print_case([0.9, 0.8])
    else:
        print(f"{name}: {value}")


def main(tuning: bool) -> pd.DataFrame:
    # 特徴量データの読み込み
    print("Loading features...")
    features_and_label: DataFrame = pd.read_csv("./feature.csv")
    print("Loaded features...!")

    # StratifiedKFoldを使用するため、featuresとlabelを分離
    features = features_and_label.drop(columns=["label", "domain"])
    label = features_and_label[["label"]]

    cv_scores_columns = ["accuracy", "precision", "recall", "f1", "auc"]
    df_cv_scores = pd.DataFrame(columns=cv_scores_columns)

    skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=5)
    for train, test in skf.split(features, label):
        print(f"\n{'-' * 50}")

        # モデルの構築
        if tuning:
            # ハイパーパラメータチューニングあり
            tuner = tfdf.tuner.RandomSearch(num_trials=100, use_predefined_hps=True)
            model = tfdf.keras.RandomForestModel(tuner=tuner)
        else:
            # ハイパーパラメータチューニングなし
            model = tfdf.keras.RandomForestModel()

        # 特徴量データの形式をtfdf用に変換
        features_and_label_train = features_and_label.drop(columns="domain").iloc[train, :]
        features_and_label_test = features_and_label.drop(columns="domain").iloc[test, :]
        features_and_label_test["label"] = features_and_label_test["label"].astype(float)
        tf_features_train = tfdf.keras.pd_dataframe_to_tf_dataset(features_and_label_train, label="label")
        tf_features_test = tfdf.keras.pd_dataframe_to_tf_dataset(features_and_label_test, label="label")

        # モデルの訓練
        model.compile(metrics=[
            "accuracy",  # 正解率、正しく予測できた割合
            metrics.TruePositives(),  # 適合率、高いほど偽陽性が少ない
            metrics.TrueNegatives(),  # 再現率、高いほど陽性を正しく陽性と分類できている
            metrics.FalsePositives(),  # F1スコア、適合率と再現率の調和平均
            metrics.FalseNegatives(),  # F1スコア、適合率と再現率の調和平均
            metrics.AUC(),  # AUC
        ])
        model.fit(tf_features_train)

        # モデルの評価
        score = model.evaluate(tf_features_test, return_dict=True)

        # 評価結果の表示
        score_tmp = []
        accuracy = tp = tn = fp = fn = auc = 0
        for name, value in score.items():
            if "accuracy" in name:
                accuracy = value
            elif "true_positives" in name:
                tp = value
            elif "true_negatives" in name:
                tn = value
            elif "false_positives" in name:
                fp = value
            elif "false_negatives" in name:
                fn = value
            elif "auc" in name:
                auc = value

        precision = tp / (tp + fp)
        print_result("precision", precision)
        recall = tp / (tp + fn)
        print_result("recall", recall)
        f1 = (2 * precision * recall) / (precision + recall)
        print_result("f1", f1)
        score_tmp.extend([accuracy, precision, recall, f1, auc])

        # 評価結果の格納
        df_append = pd.DataFrame([score_tmp], columns=cv_scores_columns)
        df_cv_scores = pd.concat([df_cv_scores, df_append], ignore_index=True)

        pprint(model.make_inspector().variable_importances())

        print(f"{'-' * 50}\n")

    # 各評価指標の平均を追加して出力
    df_append = pd.DataFrame([df_cv_scores.mean().tolist()], columns=cv_scores_columns)
    df_cv_scores = pd.concat([df_cv_scores, df_append], ignore_index=True)
    return df_cv_scores

    # モデルの保存
    # tf.saved_model.save(model, "./tf_model")
    # tfjs.converters.tf_saved_model_conversion_v2.convert_tf_saved_model("./tf_model", "./tfjs_model")


if __name__ == '__main__':
    df_no_tuning = main(tuning=False)
    # df_tuning = main(tuning=True)

    print("チューニングなし")
    print(df_no_tuning)
    # print(f"{'-' * 50}\n")
    # print("チューニングあり")
    # print(df_tuning)
