import os
import dotenv

class LoadEnv(object):
  def load(self):
    dotenv.load_dotenv(
      os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env')
    )