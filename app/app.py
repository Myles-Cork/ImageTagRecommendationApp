from flask import Flask, jsonify, request
from flask_restful import Api, Resource
from flask_cors import CORS
from pymongo import MongoClient
from PIL import Image
from transformers import ConvNextFeatureExtractor, ConvNextForImageClassification
import torch
import requests

app = Flask(__name__)
CORS(app)
api = Api(app)

client = MongoClient("mongodb://db:27017")
db = client.ImageDB
imageCollection = db["Images"]
tagCollection = db["Tags"]


def responseDict(status, msg):
    retJson = {
        "status": status,
        "msg": msg
    }
    return retJson

# Increment the count of the passed tags in the db. Inserts new tag documents for tags that don't already exist


def incrementTags(tags):
    if len(tags) != 0:
        # Get tags that already exist in db
        alreadyExistingDocs = list(tagCollection.find({"name": {"$in": tags}}))
        alreadyExistingTags = [tagDoc["name"]
                               for tagDoc in alreadyExistingDocs]

        # Add new tags to db
        newTags = [tag for tag in tags if tag not in alreadyExistingTags]
        if len(newTags) != 0:
            newDocs = []
            for tagName in newTags:
                newDocs.append({
                    "name": tagName,
                    "count": 0
                })
            tagCollection.insert_many(newDocs)

        # increment all tag counts by 1
        tagCollection.update_many(
            {"name": {"$in": tags}},
            {"$inc": {"count": 1}}
        )

# Decrement the count of the passed tags in the db. Deletes tag documents that have 0 count after decrementing


def decrementTags(tags):
    if len(tags) != 0:
        # decrement all tag counts by 1
        tagCollection.update_many(
            {"name": {"$in": tags}},
            {"$inc": {"count": -1}}
        )
        # remove tags that have 0 count
        tagCollection.delete_many({"count": {"$eq": 0}})


class AddImage(Resource):
    def post(self):
        postedData = request.get_json()

        url = postedData["url"]
        newTags = postedData["tags"]

        msg = ""

        # Check if image already exists
        if imageCollection.count_documents({"url": url}) != 0:
            # If image exists, update tags
            storedTags = imageCollection.find_one({"url": url})["tags"]
            removedTags = [tag for tag in storedTags if tag not in newTags]
            addedTags = [tag for tag in newTags if tag not in storedTags]

            # Decrement removed tags or remove completely
            decrementTags(removedTags)
            # Increment added tags
            incrementTags(addedTags)

            # Update the image in db
            imageCollection.update_one(
                {"url": url},
                {"$set": {"tags": newTags}}
            )
            msg = "Image and Tags Sucessfully Updated"
        else:
            # If image doesn't exist, add new entry to db
            # Increment tags
            incrementTags(newTags)

            # Add new image to db
            imageCollection.insert_one({
                "url": url,
                "tags": newTags
            })
            msg = "Image and Tags Sucessfully Added"

        return jsonify(responseDict(200, msg))


class QueryImages(Resource):
    def post(self):
        postedData = request.get_json()

        tags = postedData["tags"]

        imageDocs = []
        if (len(tags) == 0):
            # Get all images
            imageDocs = list(imageCollection.find())
        else:
            # Find images with tag
            imageDocs = list(imageCollection.find(
                {"tags": {"$elemMatch": {"$in": tags}}}))

        imageList = []
        for imageDoc in imageDocs:
            imageList.append(
                {"url": imageDoc["url"], "tags": imageDoc["tags"]})

        return jsonify(imageList)


class GetTags(Resource):
    def get(self):
        # Return all tag documents (without _id)
        return (list(tagCollection.find({}, {"_id": 0, "name": 1, "count": 1})))


class PredictTags(Resource):
    def post(self):

        # Read the image
        postedData = request.get_json()
        url = postedData["url"]
        image = Image.open(requests.get(url, stream=True).raw)

        # Process the image
        processor = ConvNextFeatureExtractor.from_pretrained(
            'facebook/convnext-tiny-224')
        inputs = processor(images=image, return_tensors="pt")

        # Classify the image
        model = ConvNextForImageClassification.from_pretrained(
            'facebook/convnext-tiny-224')
        classes = list(model.config.id2label.values())
        outputs = model(**inputs)
        logits = outputs.logits

        # Get top 5 values
        _, topk_idx = torch.topk(logits, k=5, axis=-1)
        tags = [model.config.id2label[x].partition(
            ",")[0].lower() for x in topk_idx.tolist()[0]]
        probabilities = torch.nn.functional.softmax(
            logits, dim=-1).tolist()[0]

        # Add to output if probability is over 0.5
        for i, p in enumerate(probabilities):
            clean_class = classes[i].partition(",")[0].lower()
            if p > 0.5 and clean_class not in tags:
                tags.append(clean_class)

        return jsonify(tags)


api.add_resource(AddImage, '/addimage')
api.add_resource(QueryImages, '/queryimages')
api.add_resource(GetTags, '/gettags')
api.add_resource(PredictTags, '/predicttags')

if __name__ == "__main__":
    app.run(host='0.0.0.0')
