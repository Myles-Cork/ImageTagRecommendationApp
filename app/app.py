from flask import Flask, jsonify, request
from flask_restful import Api, Resource
from flask_cors import CORS
from pymongo import MongoClient

app = Flask(__name__)
CORS(app)
api = Api(app)

client = MongoClient("mongodb://db:27017")
db = client.ImageDB
imageCollection = db["Images"]

def responseDict(status, msg):
    retJson = {
        "status": status,
        "msg": msg
    }
    return retJson

class AddImage(Resource):
    def post(self):
        postedData = request.get_json()

        url = postedData["url"]
        tags = postedData["tags"]

        msg = ""

        # Check if image already exists
        if imageCollection.count_documents({"url":url}) != 0:
            # if image exists, update tags
            imageCollection.update_one({
                "url": url
            },{
                "$set":{
                    "tags": tags
                }
            })
            msg = "Image and Tags Sucessfully Updated"
        else:
            # if image doesn't exist, add new entry to db
            imageCollection.insert_one({
                "url": url,
                "tags": tags
            })
            msg = "Image and Tags Sucessfully Added"

        return jsonify(responseDict(200, msg))
    
class QueryImages(Resource):
    def post(self):
        postedData = request.get_json()

        tag = postedData["tag"]
        
        imageDocs = []
        if(tag == "*"):
            # Get all images
            imageDocs = list(imageCollection.find())
        else:
            # Find images with tag
            imageDocs = list(imageCollection.find({"tags": { "$elemMatch": { "$eq": tag } }}))

        imageList = []
        for imageDoc in imageDocs:
            imageList.append({"url":imageDoc["url"],"tags":imageDoc["tags"]})

        return jsonify(imageList)

api.add_resource(AddImage, '/addimage')
api.add_resource(QueryImages, '/queryimages')

if __name__=="__main__":
    app.run(host='0.0.0.0')