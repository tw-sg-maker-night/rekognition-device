# AWS Rekognition with Webcam

## Input image source via some device
1. [x] Input image source: Maybe using Raspberry pi with webcam and motion sensor to capture faces
  * **This will be a separate python script**
  * **Comparison cost money.** (Based on the total target images used in matching)
  * Need an effective way to cut api call by detection of human. Else Moneyman will come after us. *Ahhh...*

## TO-DO
2. [x] Input image via device: should detect for new files being dropped into the folder.
3. [x] Compare source image with our people in our S3 bucket `rekognition-people`
4. [x] If match, fetch person data from image metadata
  * maybe switch to database after the iOS project is done
5. Do something:
  * [ ] Maybe play a entrance song?
  * [x] Maybe sing a birthday song if it's their bday?
6. [ ] Pass Response from Step 4 and vocalise response
  * [x] Using AWS Polly to vocalise response
  * [ ] Make vocalised response sound better with SSML?

## Some environment variables you may need
```
  //fixed settings
  AWS_REGION=us-east-1
  AWS_COLLECTION_ID=rekognition-people
  AWS_BUCKET=rekognition-people
  SIMILARITY_THRESHOLD=75

  LOCAL_DIRECTORY=/path/to/your/file/dir
```

## Get Started
1. npm start
2. go to `localhost:3000`


## AWS CLI Commands to manage Faces
Doesn't seem like there's a way to do it via the AWS Management (or maybe I can't find it)

* Upload your image to S3 bucket: `rekognition-people`
* List collections
```
  aws rekognition list-collections
```
* (If no collection found) Create a collection
```
  aws rekognition create-collection --collection-id "rekognition-people"
```
* List faces
```
  aws rekognition list-faces --collection-id rekognition-people
```
* Add Faces to collection
```
  aws rekognition index-faces \
  --image '{"S3Object":{"Bucket":"rekognition-people","Name":"Donnie-Yen.jpeg"}}' \
  --collection-id "rekognition-people" \
  --external-image-id "Donnie-Yen.jpeg"
```
* Delete Faces from collection
```
  aws rekognition delete-faces \
  --face-ids "id1,id2" \
  --collection-id "rekognition-people"
```

## Notes
AWS BUCKET: rekognition-people
