from Configrations.mongoDB import get_device_collection, get_center_collection


class db:
    @property
    def device_collection(self):
        return get_device_collection()

    @property
    def center_collection(self):
        return get_center_collection()
