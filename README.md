# AWS Rekognition with Webcam?

1. [ ] Input image source: Maybe using Raspberry pi with webcam and motion sensor to capture faces
  * **Comparison cost money**. Need a effective way to cut api call by detection of human. Else Moneyman will come after us. *Ahhh...*
2. [x] Compare source image with our people in our S3 bucket `rekognition-people`
3. If match, do something
  * [ ] Maybe play a entrance song?
  * [ ] Maybe sing a birthday song if it's their bday

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

0. Upload your image to S3 bucket: `rekognition-people`
1. List collections
    ```
    aws rekognition list-collections
    ```
2. (If no collection found) Create a collection
    ```
    aws rekognition create-collection --collection-id "rekognition-people"
    ```
3. List faces
    ```
    aws rekognition list-faces --collection-id rekognition-people
    ```
4. Add Faces to collection
    ```
    aws rekognition index-faces \
    --image '{"S3Object":{"Bucket":"rekognition-people","Name":"Donnie-Yen.jpeg"}}' \
    --collection-id "rekognition-people" \
    --external-image-id "Donnie-Yen.jpeg"
    ```
5. Delete Faces from collection
    ```
    aws rekognition delete-faces \
    --face-ids "id1,id2" \
    --collection-id "rekognition-people"
    ```

## Notes
AWS BUCKET: rekognition-people
