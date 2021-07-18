import os
import dotenv

class LoadEnv(object):
  @staticmethod
  def load():
    dotenv.load_dotenv(
      os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env')
    )