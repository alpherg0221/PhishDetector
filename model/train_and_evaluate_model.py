import logging

import pandas as pd
import tensorflow as tf
import tensorflow_decision_forests as tfdf
import tensorflowjs as tfjs
from pandas.core.interchange.dataframe_protocol import DataFrame
from rich.logging import RichHandler

# Logの設定
logging.basicConfig(
    level=logging.INFO,
    format="%(message)s",
    datefmt="[%X]",
    handlers=[RichHandler(markup=True, rich_tracebacks=True, show_path=False, omit_repeated_times=False)]
)
logger = logging.getLogger("MODEL")


def main():
    # 特徴量の読み込み
    logger.info("Loading features...")
    features: DataFrame = pd.read_csv("./feature.csv")
    features_tf = tfdf.keras.pd_dataframe_to_tf_dataset(features, label="label")
    logger.info("Loaded features...!")

    # モデルの構築
    tuner = tfdf.tuner.RandomSearch(num_trials=100, use_predefined_hps=True)
    model = tfdf.keras.RandomForestModel(tuner=tuner)
    model.fit(features_tf)
    tf.saved_model.save(model, "./tf_model")
    tfjs.converters.tf_saved_model_conversion_v2.convert_tf_saved_model("./tf_model", "./tfjs_model")


if __name__ == '__main__':
    main()
