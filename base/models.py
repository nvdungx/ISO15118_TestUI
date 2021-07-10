from django.db import models

# Create your models here.
# A model is the single, definitive source of information about your data.
# It contains the essential fields and behaviors of the data you’re storing.
# Generally, each model maps to a single database table.
# Each model is a Python class that subclasses django.db.models.Model.
# Each attribute of the model represents a database field.
# With all of this, Django gives you an automatically-generated database-access API; see Making queries.
class BaseModel(models.Model):
  # Give your model metadata by using an inner class Meta, like so:
  class Meta(object):
    # this model will be an abstract base class.
    abstract = True
    # The default ordering for the object, for use when obtaining lists of objects:
    # order object by primary key
    ordering = ('pk', )
  # 2 default field for all object created date and updated date
  date_created = models.DateTimeField(auto_now_add=True)
  date_updated = models.DateTimeField(auto_now=True)