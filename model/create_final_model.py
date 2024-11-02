import logging
import os
from pprint import pprint

# 余計なログを消す設定
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"

import pandas as pd
import tensorflow as tf
import tensorflow_decision_forests as tfdf
import tensorflowjs as tfjs
from pandas import DataFrame

# 余計なログを消す設定
tf.get_logger().setLevel(logging.ERROR)


def main():
    # 特徴量データの読み込み
    print("Loading features...")
    features_and_label: DataFrame = pd.read_csv("./feature.csv").drop(columns="domain")
    features_and_label["label"] = features_and_label["label"]
    print("Loaded features...!")

    # モデルの構築
    tuner = tfdf.tuner.RandomSearch(num_trials=100, use_predefined_hps=True)
    # model = tfdf.keras.RandomForestModel(tuner=tuner)
    model = tfdf.keras.RandomForestModel()

    # 特徴量データの形式をtfdf用に変換
    tf_features = tfdf.keras.pd_dataframe_to_tf_dataset(features_and_label, label="label")

    # モデルの訓練
    model.fit(tf_features)

    # 重要な特徴量の表示
    pprint(model.make_inspector().variable_importances())
    # model.make_inspector().evaluation()

    # モデルの保存
    tf.saved_model.save(model, "./tf_model")
    tfjs.converters.tf_saved_model_conversion_v2.convert_tf_saved_model("./tf_model", "./tfjs_model")


if __name__ == '__main__':
    main()
